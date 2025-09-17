import { API_BASE_URL } from '@/config/api';
import type { TokenDTO, LegacyTokenDTO } from '@/types/api/auth';

type Tokens = TokenDTO | LegacyTokenDTO;

interface ActiveRequest<T = unknown> {
  id: number;
  url: string;
  options: RequestInit;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
  attempt: number;
  aborted: boolean;
  controller: AbortController;
  wantsJson: boolean;
  parser?: (r: Response) => Promise<T>;
}

class AuthManager {
  private nextId = 1;
  private active: Map<number, ActiveRequest<any>> = new Map();
  private waiting401: Set<number> = new Set();
  private refreshPromise: Promise<Tokens | null> | null = null;
  private isLoggingOut = false;
  private onTokensUpdated: ((tokens: Tokens) => void) | null = null;
  private onLogout: (() => void) | null = null;
  private onRefreshingStateChange: ((b: boolean) => void) | null = null;
  private onPostLogout: (() => void) | null = null;

  setCallbacks(cb: { onTokensUpdated: (tokens: Tokens) => void; onLogout: () => void; onRefreshingStateChange: (b: boolean) => void; onPostLogout?: () => void; }) {
    this.onTokensUpdated = cb.onTokensUpdated;
    this.onLogout = cb.onLogout;
    this.onRefreshingStateChange = cb.onRefreshingStateChange;
    this.onPostLogout = cb.onPostLogout ?? null;
  }

  getAccessToken(): string | null { try { return JSON.parse(localStorage.getItem('auth') || '{}').accessToken || null; } catch { return null; } }
  // refreshToken не храним — сервер читает его из httpOnly cookie

  private normalizeTokens(raw: unknown): TokenDTO | null {
    if (!raw || typeof raw !== 'object') return null;
    const r = raw as Record<string, any>;
    const access = r.accessToken || r.access_token;
    if (!access) return null;
    // refresh не нужен на клиенте
    return { accessToken: access, refreshToken: '' } as TokenDTO;
  }

  private persistTokens(tokens: TokenDTO) {
    try {
      const current = JSON.parse(localStorage.getItem('auth') || '{}');
      // не сохраняем refresh
      localStorage.setItem('auth', JSON.stringify({ ...current, accessToken: tokens.accessToken }));
    } catch {}
  }

  private async startRefresh(): Promise<Tokens | null> {
    if (this.refreshPromise) return this.refreshPromise;
  // refresh token хранится в cookie, просто шлём запрос
    const p = (async () => {
      this.onRefreshingStateChange?.(true);
      try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, { method: 'POST', credentials: 'include' });
        if (res.status === 401) { this.performLogout(); return null; }
        if (!res.ok) return null;
        const raw = await res.json();
    const tokens = this.normalizeTokens(raw);
    if (tokens) { this.persistTokens(tokens); this.onTokensUpdated?.(tokens); }
        return tokens;
      } catch { return null; }
      finally { this.onRefreshingStateChange?.(false); }
    })();
    this.refreshPromise = p.then(t => { this.refreshPromise = null; return t; });
    return this.refreshPromise;
  }

  async forceRefresh() { return !!(await this.startRefresh()); }

  private performLogout() {
    if (this.isLoggingOut) return;
    this.isLoggingOut = true;
    try { localStorage.removeItem('auth'); } catch {}
    this.onLogout?.();
    try { this.onPostLogout?.(); } catch {}
    setTimeout(() => { this.isLoggingOut = false; }, 300);
  }

  private buildOptions(options: RequestInit, controller: AbortController): RequestInit {
    const token = this.getAccessToken();
    return { ...options, signal: controller.signal, credentials: 'include', headers: { ...(options.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) } };
  }

  private register<T>(cfg: Pick<ActiveRequest<T>, 'url' | 'options' | 'wantsJson' | 'parser'>): Promise<T> {
    const id = this.nextId++;
    const controller = new AbortController();
    return new Promise<T>((resolve, reject) => {
      const ar: ActiveRequest<T> = { id, attempt: 0, aborted: false, controller, ...cfg, resolve, reject };
      this.active.set(id, ar);
      this.dispatch(ar);
    });
  }

  private dispatch<T>(req: ActiveRequest<T>) {
    if (req.aborted) return;
    const fullUrl = req.url.startsWith('http') ? req.url : `${API_BASE_URL}${req.url}`;
    const opts = this.buildOptions(req.options, req.controller);
    req.attempt++;
    fetch(fullUrl, opts).then(async res => {
      if (res.status === 401) { this.handle401(req.id); return; }
      if (!res.ok) { this.finishWithError(req.id, new Error(`HTTP ${res.status}`)); return; }
      try {
        let data: any;
        if (req.wantsJson) data = await res.json();
        else if (req.parser) data = await req.parser(res);
        else data = res;
        this.finishOk(req.id, data as T);
      } catch (e) { this.finishWithError(req.id, e instanceof Error ? e : new Error('Parse error')); }
    }).catch(err => { if (err?.name === 'AbortError') return; this.finishWithError(req.id, err); });
  }

  private handle401(id: number) {
    if (!this.active.has(id)) return;
    this.waiting401.add(id);
    if (this.waiting401.size === 1) {
      for (const [rid, r] of this.active.entries()) {
        if (!this.waiting401.has(rid)) { try { r.controller.abort(); } catch {}; this.waiting401.add(rid); }
      }
      this.performReplayAfterRefresh();
    }
  }

  private async performReplayAfterRefresh() {
    const tokens = await this.startRefresh();
    if (!tokens) {
      const err = new Error('Unauthorized');
      for (const id of this.waiting401) this.finishWithError(id, err);
      this.waiting401.clear();
      return;
    }
    const toReplay = [...this.waiting401];
    this.waiting401.clear();
    for (const id of toReplay) {
      const r = this.active.get(id);
      if (!r) continue;
      r.controller = new AbortController();
      this.dispatch(r);
    }
  }

  private finishOk(id: number, value: unknown) { const r = this.active.get(id); if (!r) return; this.active.delete(id); r.resolve(value); }
  private finishWithError(id: number, error: unknown) { const r = this.active.get(id); if (!r) return; this.active.delete(id); r.reject(error); }

  async fetch(url: string, options: RequestInit = {}): Promise<Response> { return this.register<Response>({ url, options, wantsJson: false }); }
  async json<T>(url: string, options: RequestInit = {}): Promise<T> { return this.register<T>({ url, options: { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } }, wantsJson: true }); }
  async forceLogout(): Promise<void> { if (this.isLoggingOut) return; try { await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' }); } catch {} finally { this.performLogout(); } }
}

export const authManager = new AuthManager();
