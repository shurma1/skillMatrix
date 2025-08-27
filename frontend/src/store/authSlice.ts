import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthDTO, TokenDTO, UserDTO } from '../types/api/auth';
import type { PermissionDTO } from '../types/api/permission';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserDTO | null;
  permissions: PermissionDTO[];
}

const STORAGE_KEY = 'auth';

function loadInitial(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { 
      accessToken: null, 
      refreshToken: null, 
      user: null, 
      permissions: [] 
    };
    const parsed = JSON.parse(raw) as Partial<AuthState>;
    return {
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
      user: parsed.user ?? null,
      permissions: parsed.permissions ?? [],
    };
  } catch {
    return { 
      accessToken: null, 
      refreshToken: null, 
      user: null, 
      permissions: [] 
    };
  }
}

const initialState: AuthState = loadInitial();

function persist(state: AuthState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      persist(state);
    },
    setTokens(state, action: PayloadAction<TokenDTO>) {
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
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
      state.refreshToken = null;
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
