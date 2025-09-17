import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { logout } from './authSlice';
import { setServerOnline } from './appSlice';
import { authManager } from '@/utils/AuthManager';

type ArgShape = { url: string; method?: string; body?: any; params?: Record<string,string|number|boolean|undefined>|undefined; responseType?: 'json'|'blob'|'text'; responseHandler?: (r: Response)=>Promise<any> };
const baseQuery: BaseQueryFn<string | ArgShape , unknown, unknown> = async (arg, api) => {
  const shape: ArgShape = typeof arg === 'string' ? { url: arg } : arg;
  const { url, method = 'GET', body, params, responseType = 'json', responseHandler } = shape;
  try {
    const qs = params ? '?' + Object.entries(params).filter(([,v])=> v!==undefined).map(([k,v])=> encodeURIComponent(k)+'='+encodeURIComponent(String(v))).join('&') : '';
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const finalBody = body && !isFormData && method !== 'GET' ? JSON.stringify(body) : (isFormData ? body : undefined);
    const headers = body && !isFormData ? { 'Content-Type': 'application/json' } : undefined;
    const res = await authManager.fetch(url + qs, { method, body: finalBody, headers });
    api.dispatch(setServerOnline(true));
    if (responseHandler) return { data: await responseHandler(res) } as any;
    if (responseType === 'blob') return { data: await res.blob() } as any;
    if (responseType === 'text') return { data: await res.text() } as any;
    return { data: await res.json() } as any;
  } catch (e: any) {
    // Unauthorized propagated from AuthManager after failed refresh
    if (e?.message === 'Unauthorized') {
      api.dispatch(logout());
      return { error: { status: 401, data: 'Unauthorized' } } as any;
    }
    // AbortError (requests cancelled during refresh) — не считаем оффлайном
    if (e?.name === 'AbortError') {
      return { error: { status: 'ABORTED', data: 'Aborted' } } as any;
    }
    // HTTP errors inside AuthManager come as Error('HTTP xxx') — сервер отвечал => онлайн
    if (typeof e?.message === 'string' && /^HTTP \d{3}$/.test(e.message)) {
      return { error: { status: Number(e.message.split(' ')[1]), data: e.message } } as any;
    }
    // TypeError from fetch usually указывает на сетевую проблему (CORS/доступ/соединение)
    if (e instanceof TypeError) {
      api.dispatch(setServerOnline(false));
      return { error: { status: 'NETWORK_ERROR', data: e.message } } as any;
    }
    // Default fallback — не считаем оффлайном чтобы избежать ложных флагов
    return { error: { status: e?.status || 'FETCH_ERROR', data: e?.message || 'Error' } } as any;
  }
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  // Отключаем автоматический рефетч при изменении фокуса, чтобы избежать лишних запросов
  refetchOnFocus: false,
  // Отключаем автоматический рефетч при переподключении
  refetchOnReconnect: false,
  tagTypes: [
  'User','Skill','SkillVersions','JobRole','Tag','File','Image','Test','UserSkill','UserSkills','SkillUsers','JobRoleSkill','Profile','ProfileSkill','MyJobroles','MySkills','MyJobroleSkills','MyServicedSkills','MyPermissions','UserJobroleSkillsByJobrole'
  ],
  endpoints: () => ({
    // logout убран из RTK Query - теперь только через authManager.forceLogout()
  }),
});

export const { } = baseApi;
