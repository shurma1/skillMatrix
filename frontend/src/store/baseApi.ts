import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';
import { logout, setTokens } from './authSlice';
import type { TokenDTO } from '../types/api/auth';
import {API_BASE_URL} from "@/config/api.ts";
import { setServerOnline } from './appSlice';

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
  result = await rawBaseQuery(args, api, extraOptions);
  api.dispatch(setServerOnline(true));
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
  'User','Skill','SkillVersions','JobRole','Tag','File','Image','Test','UserSkill','UserSkills','SkillUsers','JobRoleSkill','Profile','ProfileSkill','MyJobroles','MySkills','MyJobroleSkills','MyPermissions','UserJobroleSkillsByJobrole'
  ],
  endpoints: () => ({}),
});
