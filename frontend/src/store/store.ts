import { configureStore, combineReducers, type AnyAction } from '@reduxjs/toolkit';
import authReducer, { logout, setTokens } from './authSlice';
import themeReducer from './themeSlice';
import { baseApi } from './baseApi';
import appReducer from './appSlice';
import { authManager } from '@/utils/AuthManager';
import { setRefreshingTokens } from './appSlice';

// Собираем основной комбинированный редьюсер
const appCombinedReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  app: appReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

// Root reducer: очистка всего кроме темы при logout
const rootReducer = (state: ReturnType<typeof appCombinedReducer> | undefined, action: AnyAction) => {
  if (action.type === logout.type) {
    const preservedTheme = state?.theme; // сохраняем текущую тему
    const initialState = appCombinedReducer(undefined, { type: '@@INIT' });
    return {
      ...initialState,
      theme: preservedTheme ?? initialState.theme,
    } as ReturnType<typeof appCombinedReducer>;
  }
  return appCombinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [
          'api/executeQuery/fulfilled',
          'api/executeQuery/rejected',
          'api/executeQuery/pending',
          'api/executeMutation/fulfilled',
          'api/executeMutation/rejected',
          'api/executeMutation/pending',
        ],
        ignoredActionsPaths: [
          'payload',
          'payload.data',
          'error',
          'meta.baseQueryMeta',
        ],
        ignoredPaths: [
          'api',
        ],
      },
    }).concat(baseApi.middleware),
});

// Wire AuthManager callbacks once store is created
authManager.setCallbacks({
  onTokensUpdated: (t) => {
    // t.refreshToken может быть пустой строкой — игнорируем
    store.dispatch(setTokens({ accessToken: (t as any).accessToken, refreshToken: '' } as any));
  },
  onLogout: () => {
    store.dispatch(logout());
  },
  onRefreshingStateChange: (b) => {
    store.dispatch(setRefreshingTokens(b));
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
