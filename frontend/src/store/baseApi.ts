import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';
import { logout, setTokens } from './authSlice';
import type { TokenDTO } from '../types/api/auth';
import {API_BASE_URL} from "@/config/api.ts";
import { setServerOnline, setRefreshingTokens } from './appSlice';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
  const state = getState() as RootState;
    const token = state.auth.accessToken;
  if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
  credentials: 'include',
});

// Глобальное состояние для отслеживания процесса refresh
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  // Mark offline on network error (status undefined or 'FETCH_ERROR')
  if ((result as any).error && (!('status' in (result as any).error) || (result as any).error.status === 'FETCH_ERROR')) {
    api.dispatch(setServerOnline(false));
  } else {
    api.dispatch(setServerOnline(true));
  }
  
  const isRefreshCall = typeof args === 'object' && (args as FetchArgs).url?.includes('/api/auth/refresh');
  
  if (result.error && result.error.status === 401 && !isRefreshCall) {
    // Если refresh уже выполняется, ждем его завершения
    if (isRefreshing && refreshPromise) {
      try {
        await refreshPromise;
        // После завершения refresh повторяем оригинальный запрос
        result = await rawBaseQuery(args, api, extraOptions);
        return result;
      } catch (error) {
        // Если refresh неудачный, возвращаем ошибку авторизации
        return result;
      }
    }

    // Запускаем refresh токенов
    isRefreshing = true;
    api.dispatch(setRefreshingTokens(true));
    
    refreshPromise = (async () => {
      const refreshResult = await rawBaseQuery(
        {
          url: '/api/auth/refresh',
          method: 'POST',
          credentials: 'include',
        },
        api,
        extraOptions,
      );
      
      if (refreshResult.data) {
        const tokens = refreshResult.data as TokenDTO;
        api.dispatch(setTokens(tokens));
        api.dispatch(setServerOnline(true));
        return { success: true };
      } else {
        api.dispatch(logout());
        throw new Error('Refresh failed');
      }
    })();

    try {
      await refreshPromise;
      // Повторяем оригинальный запрос с новым токеном
      result = await rawBaseQuery(args, api, extraOptions);
    } catch (error) {
      // Refresh failed, logout already called
    } finally {
      // Сбрасываем состояние refresh
      isRefreshing = false;
      refreshPromise = null;
      api.dispatch(setRefreshingTokens(false));
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  // Отключаем автоматический рефетч при изменении фокуса, чтобы избежать лишних запросов
  refetchOnFocus: false,
  // Отключаем автоматический рефетч при переподключении
  refetchOnReconnect: false,
  tagTypes: [
  'User','Skill','SkillVersions','JobRole','Tag','File','Image','Test','UserSkill','UserSkills','SkillUsers','JobRoleSkill','Profile','ProfileSkill','MyJobroles','MySkills','MyJobroleSkills','MyServicedSkills','MyPermissions','UserJobroleSkillsByJobrole'
  ],
  endpoints: (builder) => ({
    logout: builder.mutation<{success: boolean}, void>({
      query: () => ({ url: '/api/auth/logout', method: 'POST' }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(logout());
        }
      }
    }),
  }),
});

export const { useLogoutMutation } = baseApi;
