import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthDTO, TokenDTO, UserDTO, LegacyTokenDTO } from '../types/api/auth';
import type { PermissionDTO } from '../types/api/permission';

export interface AuthState {
  accessToken: string | null;
  // refreshToken убран из хранения (cookie-based)
  user: UserDTO | null;
  permissions: PermissionDTO[];
}

const STORAGE_KEY = 'auth';

function loadInitial(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { accessToken: null, user: null, permissions: [] };
    const parsed = JSON.parse(raw) as Partial<AuthState>;
    return {
      accessToken: parsed.accessToken ?? null,
      user: parsed.user ?? null,
      permissions: parsed.permissions ?? [],
    };
  } catch {
    return { accessToken: null, user: null, permissions: [] };
  }
}

const initialState: AuthState = loadInitial();

function persist(state: AuthState) {
  try {
  const { accessToken, user, permissions } = state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ accessToken, user, permissions }));
  } catch {
    /* ignore quota */
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthDTO>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      persist(state);
    },
    setTokens(state, action: PayloadAction<TokenDTO | LegacyTokenDTO>) {
      const anyPayload = action.payload as any;
      state.accessToken = anyPayload.accessToken || anyPayload.access_token;
      // refreshToken игнорируем
      persist(state);
    },
    setUser(state, action: PayloadAction<UserDTO>) {
      state.user = action.payload;
      persist(state);
    },
    setPermissions(state, action: PayloadAction<PermissionDTO[]>) {
      state.permissions = action.payload;
      persist(state);
    },
    updateUserAvatar(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.avatar_id = action.payload;
        persist(state);
      }
    },
    logout(state) {
      state.accessToken = null;
      state.user = null;
      state.permissions = [];
      persist(state);
    },
  },
});

export const { 
  setAuth, 
  setTokens, 
  setUser, 
  setPermissions, 
  updateUserAvatar, 
  logout 
} = authSlice.actions;
export default authSlice.reducer;
