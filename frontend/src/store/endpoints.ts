import { baseApi } from './baseApi';
import type {
  LoginRequestDTO,
  AuthDTO,
  RefreshRequestDTO,
  TokenDTO,
  UserDTO
} from '../types/api/auth';
import type { PaginatedResponse } from '../types/api/common';
import type {
  SkillWithCurrentVersionDTO,
  CreateSkillDTO,
  UpdateSkillDTO,
  SkillVersionDTO,
  CreateSkillVersionDTO,
  MakeRevisionDTO
} from '../types/api/skill';
import type { UpdateSkillVersionDTO } from '../types/api/skill';
import type { FileDTO } from '../types/api/file';
import type { ImageDTO } from '../types/api/image';
import type {
  TagDTO,
  TagSearchDTO,
  TagCreateDTO,
  TagUpdateDTO
} from '../types/api/tag';
import type {
  JobRoleDTO,
  JobRoleSkillSearchDTO,
  JobRoleUserSearchDTO,
  CreateJobRoleDTO,
  UpdateJobRoleDTO,
  AddJobRoleSkillDTO,
  UpdateJobRoleSkillDTO
} from '../types/api/jobrole';
import type {
  AddUserSkillDTO,
  UpdateUserSkillTargetLevelDTO,
  AddUserJobroleDTO,
  UserCreateDTO,
  UserSkillDto,
  UserSkillSearchDto,
  ConfirmationDTO,
  ConfirmationCreateDTO,
  UserUpdateDTO,
  UserStatsDTO
} from '../types/api/user';
import type { UserResultPreviewDTO } from '../types/api/user';
import type {
  CreateTestDTO,
  StartTestDTO,
  EndTestDTO,
  SendAnswerDTO,
  TestDTO,
  PreviewTestDto,
  StartTestResponseDTO,
  UserTestResultDTO,
  TestAnswerProgressDTO
} from '../types/api/test';
import type { PermissionDTO } from '../types/api/permission';

export const api = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Analytics
    getAnalyticsKPI: build.query<{ colLabels: string[]; rowLabels: string[]; data: number[][] }, void>({
      query: () => '/api/analytics/kpi',
      // Отключаем кеширование для аналитических данных, так как они постоянно изменяются
      keepUnusedDataFor: 0,
    }),
    getAnalyticsJobRolesToSkills: build.query<{
      left: { colLabels: string[]; data: (string | number | null)[][] };
      right: { colLabels: [string[], number[], number[]]; data: number[][] };
    }, void>({
      query: () => '/api/analytics/jobRolesToSkills',
      // Отключаем кеширование для аналитических данных, так как они постоянно изменяются
      keepUnusedDataFor: 0,
    }),
    getAnalyticsJobRoleToSkills: build.query<{
      left: { colLabels: string[]; data: (string | number | null)[][] };
      middle: { colLabels: [string[], string[], number[]]; data: number[][] };
      right: { colLabels: [string[], number[], number[]]; data: number[][] };
    }, { jobRoleId: string; userId?: string }>({
      query: ({ jobRoleId, userId }) => ({
        url: '/api/analytics/jobRoleToSkills',
        params: { jobRoleId, ...(userId && { userId }) }
      }),
      // Отключаем кеширование для аналитических данных, так как они постоянно изменяются
      keepUnusedDataFor: 0,
    }),
    getAnalyticsUserToSkills: build.query<{
      user: {
        id: string;
        login: string;
        firstname: string;
        lastname: string;
        patronymic?: string;
      };
      left: { colLabels: string[]; data: (string | number | null)[][] };
      middle: { colLabels: Array<[string[], string[], number[]]>; data: number[][] };
      right: { colLabels: [string[], number[], number[]]; data: number[][] };
      summary: {
        totalTargetLevel: number;
        totalCurrentLevel: number;
        totalPercent: number;
      };
    }, string>({
      query: (userId) => `/api/analytics/userToSkills/${userId}`,
      // Отключаем кеширование для аналитических данных, так как они постоянно изменяются
      keepUnusedDataFor: 0,
    }),
    getMySharedStat: build.query<{
      user: {
        id: string;
        login: string;
        firstname: string;
        lastname: string;
        patronymic?: string;
      };
      left: { colLabels: string[]; data: (string | number | null)[][] };
      middle: { colLabels: Array<[string[], string[], number[]]>; data: number[][] };
      right: { colLabels: [string[], number[], number[]]; data: number[][] };
      summary: {
        totalTargetLevel: number;
        totalCurrentLevel: number;
        totalPercent: number;
      };
    }, void>({
      query: () => '/api/me/sharedStat',
      // Отключаем кеширование для аналитических данных, так как они постоянно изменяются
      keepUnusedDataFor: 0,
    }),
    downloadMySharedStat: build.query<{ blob: Blob; filename?: string }, void>({
      query: () => ({
        url: '/api/me/sharedStat/download',
        responseHandler: async (response) => {
          if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `HTTP ${response.status}`);
          }
          const cd = response.headers.get('Content-Disposition') || undefined;
          const match = cd?.match(/filename\*=UTF-8''([^;]+)/);
          const filename = match ? decodeURIComponent(match[1]) : undefined;
          const blob = await response.blob();
          return { blob, filename };
        },
      }),
      keepUnusedDataFor: 0,
    }),
    getAnalyticsSkillToUsers: build.query<{
      skill: {
        id?: string;
        title?: string;
        version?: number;
        documentId?: string | null;
      };
      colLabels: string[];
      data: (string | number | null)[][];
    }, string>({
      query: (skillId) => `/api/analytics/skillToUsers/${skillId}`,
      // Отключаем кеширование для аналитических данных, так как они постоянно изменяются
      keepUnusedDataFor: 0,
    }),
    // Downloads (Excel)
    downloadAnalyticsKPI: build.query<{ blob: Blob; filename?: string }, void>({
      query: () => ({
        url: '/api/analytics/kpi/download',
        responseHandler: async (response) => {
          if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `HTTP ${response.status}`);
          }
          const cd = response.headers.get('Content-Disposition') || undefined;
          const match = cd?.match(/filename\*=UTF-8''([^;]+)/);
          const filename = match ? decodeURIComponent(match[1]) : undefined;
          const blob = await response.blob();
          return { blob, filename };
        },
      }),
      keepUnusedDataFor: 0,
    }),
    downloadAnalyticsJobRolesToSkills: build.query<{ blob: Blob; filename?: string }, void>({
      query: () => ({
        url: '/api/analytics/jobRolesToSkills/download',
        responseHandler: async (response) => {
          if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `HTTP ${response.status}`);
          }
          const cd = response.headers.get('Content-Disposition') || undefined;
          const match = cd?.match(/filename\*=UTF-8''([^;]+)/);
          const filename = match ? decodeURIComponent(match[1]) : undefined;
          const blob = await response.blob();
          return { blob, filename };
        },
      }),
      keepUnusedDataFor: 0,
    }),
    downloadAnalyticsJobRoleToSkills: build.query<{ blob: Blob; filename?: string }, { jobRoleId: string; userId?: string }>({
      query: ({ jobRoleId, userId }) => ({
        url: '/api/analytics/jobRoleToSkills/download',
        params: { jobRoleId, ...(userId && { userId }) },
        responseHandler: async (response) => {
          if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `HTTP ${response.status}`);
          }
          const cd = response.headers.get('Content-Disposition') || undefined;
          const match = cd?.match(/filename\*=UTF-8''([^;]+)/);
          const filename = match ? decodeURIComponent(match[1]) : undefined;
          const blob = await response.blob();
          return { blob, filename };
        },
      }),
      keepUnusedDataFor: 0,
    }),
    downloadAnalyticsUserToSkills: build.query<{ blob: Blob; filename?: string }, string>({
      query: (userId) => ({
        url: `/api/analytics/userToSkills/${userId}/download`,
        responseHandler: async (response) => {
          if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `HTTP ${response.status}`);
          }
          const cd = response.headers.get('Content-Disposition') || undefined;
          const match = cd?.match(/filename\*=UTF-8''([^;]+)/);
          const filename = match ? decodeURIComponent(match[1]) : undefined;
          const blob = await response.blob();
          return { blob, filename };
        },
      }),
      keepUnusedDataFor: 0,
    }),
    downloadAnalyticsSkillToUsers: build.query<{ blob: Blob; filename?: string }, string>({
      query: (skillId) => ({
        url: `/api/analytics/skillToUsers/${skillId}/download`,
        responseHandler: async (response) => {
          if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `HTTP ${response.status}`);
          }
          const cd = response.headers.get('Content-Disposition') || undefined;
          const match = cd?.match(/filename\*=UTF-8''([^;]+)/);
          const filename = match ? decodeURIComponent(match[1]) : undefined;
          const blob = await response.blob();
          return { blob, filename };
        },
      }),
      keepUnusedDataFor: 0,
    }),
    // Auth
    login: build.mutation<AuthDTO, LoginRequestDTO>({
      query: (body) => ({ url: '/api/auth/login', method: 'POST', body }),
    }),
    refresh: build.mutation<TokenDTO, RefreshRequestDTO>({
      query: (body) => ({ url: '/api/auth/refresh', method: 'POST', body }),
    }),

    // File
    getFileInfo: build.query<FileDTO, string>({
      query: (id) => `/api/file/${id}/info`,
      keepUnusedDataFor: 0,
    }),
    downloadFile: build.query<Blob, string>({
      query: (id) => ({ 
        url: `/api/file/${id}`, 
        responseHandler: async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP ${response.status}`);
          }
          return response.blob();
        }
      }),
      keepUnusedDataFor: 0, // Don't cache blob data
    }),
    uploadFile: build.mutation<FileDTO, { name: string; file: File }>({
      query: ({ name, file }) => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('file', file);
        return { url: '/api/file', method: 'POST', body: formData }; // headers set automatically w/out json
      },
      invalidatesTags: ['File'],
    }),
    confirmFileAcknowledgment: build.mutation<void, string>({
      query: (id) => ({ url: `/api/file/${id}/confirm`, method: 'GET' }),
    }),

    // Image
    getImageInfo: build.query<ImageDTO, string>({
      query: (id) => `/api/image/${id}/info`,
      keepUnusedDataFor: 0,
    }),
    getImage: build.query<Blob, { id: string; thumb?: boolean }>({
      query: ({ id, thumb }) => ({
        url: `/api/image/${id}`,
        params: thumb ? { thumb } : undefined,
        responseHandler: async (response) => {
          if (!response.ok) {
            // For errors, return text instead of blob to avoid serialization issues
            const errorText = await response.text();
            throw new Error(errorText || `HTTP ${response.status}`);
          }
          return response.blob();
        }
      }),
      keepUnusedDataFor: 0, // Don't cache blob data
      serializeQueryArgs: ({ queryArgs }) => {
        // Create unique cache key but don't store data
        return `${queryArgs.id}_${queryArgs.thumb || false}`;
      },
    }),
    uploadImage: build.mutation<ImageDTO, { image: File }>({
      query: ({ image }) => {
        const fd = new FormData();
        fd.append('image', image);
        return {
          url: '/api/image/upload',
          method: 'POST',
          body: fd
        };
      },
      invalidatesTags: ['Image'],
    }),

    // JobRole
    searchJobRoles: build.query<
      { count: number; rows: JobRoleDTO[] },
      { query: string; limit?: number; page?: number }
    >({
      query: (params) => ({ url: '/api/jobrole/search', params }),
      keepUnusedDataFor: 0,
    }),
    createJobRole: build.mutation<JobRoleDTO, CreateJobRoleDTO>({
      query: (body) => ({ url: '/api/jobrole', method: 'POST', body }),
      invalidatesTags: ['JobRole'],
    }),
    getJobRole: build.query<JobRoleDTO, string>({
      query: (id) => `/api/jobrole/${id}`,
      keepUnusedDataFor: 0,
    }),
    updateJobRole: build.mutation<
      JobRoleDTO,
      { id: string; body: UpdateJobRoleDTO }
    >({
      query: ({ id, body }) => ({
        url: `/api/jobrole/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'JobRole' as const, id }],
    }),
    deleteJobRole: build.mutation<void, string>({
      query: (id) => ({ url: `/api/jobrole/${id}`, method: 'DELETE' }),
      invalidatesTags: ['JobRole'],
    }),
    listJobRoleUsers: build.query<JobRoleUserSearchDTO[], string>({
      query: (id) => `/api/jobrole/${id}/user`,
      keepUnusedDataFor: 0,
    }),
    assignUserToJobRole: build.mutation<
      UserDTO,
      { id: string; userId: string }
    >({
      query: ({ id, userId }) => ({
        url: `/api/jobrole/${id}/user`,
        method: 'POST',
        body: { userId }
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'JobRole' as const, id }],
    }),
    unassignUserFromJobRole: build.mutation<
      void,
      { id: string; userId: string }
    >({
      query: ({ id, userId }) => ({
        url: `/api/jobrole/${id}/user/${userId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'JobRole' as const, id }],
    }),
    listJobRoleSkills: build.query<JobRoleSkillSearchDTO[], string>({
      query: (id) => `/api/jobrole/${id}/skill`,
      keepUnusedDataFor: 0,
    }),
    addJobRoleSkill: build.mutation<
      JobRoleSkillSearchDTO,
      { id: string; data: AddJobRoleSkillDTO }
    >({
      query: ({ id, data }) => ({
        url: `/api/jobrole/${id}/skill`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'JobRoleSkill' as const, id }],
    }),
    updateJobRoleSkill: build.mutation<
      JobRoleSkillSearchDTO,
      { id: string; skillId: string; data: UpdateJobRoleSkillDTO }
    >({
      query: ({ id, skillId, data }) => ({
        url: `/api/jobrole/${id}/skill/${skillId}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'JobRoleSkill' as const, id }],
    }),
    deleteJobRoleSkill: build.mutation<
      void,
      { id: string; skillId: string }
    >({
      query: ({ id, skillId }) => ({
        url: `/api/jobrole/${id}/skill/${skillId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'JobRoleSkill' as const, id }],
    }),

    // Skill
    searchSkills: build.query<
      PaginatedResponse<SkillWithCurrentVersionDTO>,
      {
        query: string;
        limit?: number;
        page?: number;
        tags?: string;
        authorIds?: string;
        verifierIds?: string;
        approvedDates?: string;
        auditDates?: string;
        needRevision?: boolean;
      }
    >({
      query: (params) => ({ url: '/api/skill/search', params }),
      keepUnusedDataFor: 0,
    }),
    createSkill: build.mutation<SkillWithCurrentVersionDTO, CreateSkillDTO>({
      query: (body) => ({ url: '/api/skill', method: 'POST', body }),
      invalidatesTags: ['Skill'],
    }),
    deleteSkill: build.mutation<void, string>({
      query: (id) => ({ url: `/api/skill/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Skill'],
    }),
    updateSkill: build.mutation<
      SkillWithCurrentVersionDTO,
      { id: string; body: UpdateSkillDTO }
    >({
      query: ({ id, body }) => ({
        url: `/api/skill/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Skill' as const, id }],
    }),
    getSkill: build.query<SkillWithCurrentVersionDTO, string>({
      query: (id) => `/api/skill/${id}`,
      providesTags: (_, __, id) => [{ type: 'Skill' as const, id }],
    }),
    listSkillUsers: build.query<UserSkillSearchDto[], string>({
      query: (id) => `/api/skill/${id}/user`,
      keepUnusedDataFor: 0,
    }),
    listAllSkillUsers: build.query<UserSkillSearchDto[], string>({
      query: (id) => `/api/skill/${id}/allUsers`,
      keepUnusedDataFor: 0,
    }),
    addTagToSkill: build.mutation<void, { id: string; tagId: string }>({
      query: ({ id, tagId }) => ({
        url: `/api/skill/${id}/tag`,
        method: 'POST',
        body: { tagId }
      }),
      invalidatesTags: ['Skill', 'Tag']
    }),
    getSkillTags: build.query<TagDTO[], string>({
      query: (id) => `/api/skill/${id}/tags`,
      keepUnusedDataFor: 0,
    }),
    removeTagFromSkill: build.mutation<void, { id: string; tagId: string }>({
      query: ({ id, tagId }) => ({
        url: `/api/skill/${id}/tag/${tagId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Skill', 'Tag']
    }),
    createSkillVersion: build.mutation<
      SkillVersionDTO,
      { id: string; body: CreateSkillVersionDTO }
    >({
      query: ({ id, body }) => ({
        url: `/api/skill/${id}/version`,
        method: 'POST',
        body
      }),
      // Invalidate skill data to update version info on skill page
      invalidatesTags: (_, __, { id }) => [
        { type: 'Skill' as const, id },
        'SkillVersions'
      ],
    }),
    listSkillVersions: build.query<SkillVersionDTO[], string>({
      query: (id) => `/api/skill/${id}/version`,
      providesTags: (_, __, id) => ['SkillVersions', { type: 'Skill' as const, id }],
    }),
    getSkillVersion: build.query<
      SkillVersionDTO,
      { id: string; versionId: string }
    >({
      query: ({ id, versionId }) => `/api/skill/${id}/version/${versionId}`,
      keepUnusedDataFor: 0,
    }),
    deleteSkillVersion: build.mutation<
      void,
      { id: string; versionId: string }
    >({
      query: ({ id, versionId }) => ({
        url: `/api/skill/${id}/version/${versionId}`,
        method: 'DELETE'
      }),
      // Invalidate skill and versions data
      invalidatesTags: (_, __, { id }) => [
        { type: 'Skill' as const, id },
        'SkillVersions'
      ],
    }),
    updateSkillVersion: build.mutation<
      SkillVersionDTO,
  { id: string; versionId: string; body: UpdateSkillVersionDTO }
    >({
      query: ({ id, versionId, body }) => ({
        url: `/api/skill/${id}/version/${versionId}`,
        method: 'PUT',
        body,
      }),
      // Invalidate skill and versions data
      invalidatesTags: (_, __, { id }) => [
        { type: 'Skill' as const, id },
        'SkillVersions'
      ],
    }),
    makeRevision: build.mutation<void, MakeRevisionDTO>({
      query: (body) => ({
        url: '/api/skill/makeRevision',
        method: 'POST',
        body
      }),
      invalidatesTags: (_, __, { skillId }) => [{ type: 'Skill' as const, id: skillId }],
    }),

    // Tag
    searchTags: build.query<TagSearchDTO[], { query: string }>({
      query: (params) => ({ url: '/api/tag/search', params }),
      keepUnusedDataFor: 0,
    }),
    getTag: build.query<TagDTO, string>({
      query: (id) => `/api/tag/${id}`,
      keepUnusedDataFor: 0,
    }),
    updateTag: build.mutation<TagDTO, { id: string; body: TagUpdateDTO }>({
      query: ({ id, body }) => ({
        url: `/api/tag/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Tag' as const, id }],
    }),
    deleteTag: build.mutation<void, string>({
      query: (id) => ({ url: `/api/tag/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Tag'],
    }),
    createTag: build.mutation<TagDTO, TagCreateDTO>({
      query: (body) => ({ url: '/api/tag', method: 'POST', body }),
      invalidatesTags: ['Tag'],
    }),

    // Test
    createTest: build.mutation<
      TestDTO,
      CreateTestDTO & { skillId: string }
    >({
      query: ({ skillId, ...body }) => ({
        url: '/api/test',
        method: 'POST',
        body: { ...body, skillId }
      }),
      // Invalidate both test and skill data to update test info on skill page
      invalidatesTags: (_, __, { skillId }) => [
        'Test',
        { type: 'Skill' as const, id: skillId }
      ],
    }),
    startTest: build.mutation<StartTestResponseDTO, StartTestDTO>({
      query: (body) => ({ url: '/api/test/start', method: 'POST', body }),
    }),
    endTest: build.mutation<void, EndTestDTO>({
      query: (body) => ({ url: '/api/test/end', method: 'POST', body }),
    }),
    sendAnswer: build.mutation<TestAnswerProgressDTO, SendAnswerDTO>({
      query: (body) => ({ url: '/api/test/sendAnswer', method: 'POST', body }),
    }),
    getUserTestResult: build.query<
      UserTestResultDTO,
      { skillId: string; userId: string }
    >({
      query: ({ skillId, userId }) => ({
        url: '/api/test/result',
        params: { skillId },
        body: { userId }
      })
    }),
    getTestResult: build.query<UserTestResultDTO, string>({
      query: (testId) => `/api/test/${testId}/result`,
      keepUnusedDataFor: 0,
    }),
    getUserTestResultByUser: build.query<UserTestResultDTO, { testId: string; userId: string }>({
      query: ({ testId, userId }) => `/api/test/${testId}/result/user/${userId}`,
      keepUnusedDataFor: 0,
    }),
    getTest: build.query<PreviewTestDto, string>({
      query: (testId) => `/api/test/${testId}`,
      keepUnusedDataFor: 0,
    }),
    getTestFull: build.query<TestDTO, string>({
      query: (testId) => `/api/test/${testId}/full`,
      keepUnusedDataFor: 0,
    }),
    updateTest: build.mutation<TestDTO, { testId: string; body: CreateTestDTO }>({
      query: ({ testId, body }) => ({ url: `/api/test/${testId}`, method: 'PUT', body }),
      // Also invalidate skill data since test info affects skill page
      invalidatesTags: (_r, _e, { testId, body }) => [
        { type: 'Test' as const, id: testId },
        'Test',
        // If we have skillId in the response, we can be more specific
        'Skill'
      ],
    }),
    getCanDeleteTest: build.query<{ can: boolean }, string>({
      query: (testId) => `/api/test/${testId}/can-delete`,
      keepUnusedDataFor: 0,
    }),
    deleteUserTestResult: build.mutation<void, { testId: string; userId: string }>({
      query: ({ testId, userId }) => ({
        url: `/api/test/${testId}/result/user/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { testId }) => [{ type: 'Test' as const, id: testId }],
    }),
    // User
    searchUsers: build.query<
      PaginatedResponse<UserDTO>,
      { query: string; limit?: number; page?: number }
    >({
      query: (params) => ({ url: '/api/user/search', params }),
      keepUnusedDataFor: 0,
    }),
    createUser: build.mutation<UserDTO, UserCreateDTO>({
      query: (body) => ({ url: '/api/user', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),
    getUser: build.query<UserDTO, string>({
      query: (id) => `/api/user/${id}`,
      keepUnusedDataFor: 0,
    }),
    updateUser: build.mutation<UserDTO, { id: string; body: UserUpdateDTO }>({
      query: ({ id, body }) => ({
        url: `/api/user/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'User' as const, id }],
    }),
    deleteUser: build.mutation<void, string>({
      query: (id) => ({ url: `/api/user/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
    listUserSkills: build.query<UserSkillSearchDto[], string>({
      query: (id) => `/api/user/${id}/skill`,
      keepUnusedDataFor: 0,
    }),
    addUserSkill: build.mutation<
      UserSkillDto,
      { id: string; body: AddUserSkillDTO }
    >({
      query: ({ id, body }) => ({
        url: `/api/user/${id}/skill`,
        method: 'POST',
        body
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'UserSkills' as const, id }]
    }),
    getUserSkill: build.query<
      UserSkillDto,
      { id: string; skillId: string }
    >({
      query: ({ id, skillId }) => `/api/user/${id}/skill/${skillId}`,
      keepUnusedDataFor: 0,
    }),
    updateUserSkillTarget: build.mutation<
      UserSkillDto,
      { id: string; skillId: string; body: UpdateUserSkillTargetLevelDTO }
    >({
      query: ({ id, skillId, body }) => ({
        url: `/api/user/${id}/skill/${skillId}`,
        method: 'PUT',
        body
      }),
      // Re-fetch user skills caches for this user (covers both additional and jobrole skills lists)
      invalidatesTags: (_, __, { id }) => [{ type: 'UserSkills' as const, id }]
    }),
    deleteUserSkill: build.mutation<
      void,
      { id: string; skillId: string }
    >({
      query: ({ id, skillId }) => ({
        url: `/api/user/${id}/skill/${skillId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'UserSkills' as const, id }]
    }),
    listUserJobroles: build.query<JobRoleDTO[], string>({
      query: (id) => `/api/user/${id}/jobrole`,
      keepUnusedDataFor: 0,
    }),
    addUserJobrole: build.mutation<
      JobRoleDTO,
      { id: string; body: AddUserJobroleDTO }
    >({
      query: ({ id, body }) => ({
        url: `/api/user/${id}/jobrole`,
        method: 'POST',
        body
      })
    }),
    listUserSkillsInJobrole: build.query<
      UserSkillSearchDto[],
      { id: string; jobroleId: string }
    >({
      query: ({ id, jobroleId }) => `/api/user/${id}/jobrole/${jobroleId}/skill`,
      keepUnusedDataFor: 0,
    }),
    removeUserJobrole: build.mutation<
      void,
      { id: string; jobroleId: string }
    >({
      query: ({ id, jobroleId }) => ({
        url: `/api/user/${id}/jobrole/${jobroleId}`,
        method: 'DELETE'
      })
    }),
    listUserSkillConfirmations: build.query<
      ConfirmationDTO[],
      { id: string; skillId: string }
    >({
      query: ({ id, skillId }) => `/api/user/${id}/skill/${skillId}/confirmation`,
      keepUnusedDataFor: 0,
    }),
    addUserSkillConfirmation: build.mutation<ConfirmationDTO, { id: string; skillId: string; body: ConfirmationCreateDTO }>({
      query: ({ id, skillId, body }) => ({
        url: `/api/user/${id}/skill/${skillId}/confirmation`,
        method: 'POST',
        body,
      }),
  invalidatesTags: (_result, _error, { id }) => [
        // Broad user skills list
        { type: 'UserSkills' as const, id },
        // Note: We cannot know jobroleId here; specific panel refetch is driven by the list's own providesTags when it's active
      ],
    }),
    deleteUserSkillConfirmation: build.mutation<void, { id: string; skillId: string; confirmationId: string }>({ 
      query: ({ id, skillId, confirmationId })=> ({ 
        url: `/api/user/${id}/skill/${skillId}/confirmation/${confirmationId}`, 
        method: 'DELETE' 
      }),
  invalidatesTags: (_result, _error, { id }) => [
        { type: 'UserSkills' as const, id },
      ],
    }),

    // Profile (current user)
    getProfile: build.query<UserDTO, void>({
      query: () => '/api/me/profile',
      providesTags: ['Profile'],
    }),
    getProfileStats: build.query<UserStatsDTO, void>({
      query: () => '/api/me/stats',
      keepUnusedDataFor: 0,
    }),
    updateProfile: build.mutation<UserDTO, UserUpdateDTO>({
      query: (body) => ({ url: '/api/me/profile', method: 'PUT', body }),
      invalidatesTags: ['Profile'],
    }),
    listProfileSkills: build.query<UserSkillSearchDto[], void>({ 
      query: () => '/api/me/profile/skill', 
      providesTags: ['ProfileSkill'] 
    }),
    addProfileSkill: build.mutation<UserSkillDto, AddUserSkillDTO>({ 
      query: (body) => ({ url: '/api/me/profile/skill', method: 'POST', body }), 
      invalidatesTags: ['ProfileSkill'] 
    }),
    getProfileSkill: build.query<UserSkillDto, string>({ 
      query: (skillId) => `/api/me/profile/skill/${skillId}`,
      keepUnusedDataFor: 0,
    }),
    updateProfileSkillTarget: build.mutation<UserSkillDto, { skillId: string; body: UpdateUserSkillTargetLevelDTO }>({ 
      query: ({ skillId, body }) => ({ url: `/api/me/profile/skill/${skillId}`, method: 'PUT', body }), 
      // Also refresh my jobrole skills lists so UI stays consistent
      invalidatesTags: ['ProfileSkill', 'MyJobroleSkills', 'MySkills'] 
    }),
    deleteProfileSkill: build.mutation<void, string>({ 
      query: (skillId) => ({ url: `/api/me/profile/skill/${skillId}`, method: 'DELETE' }), 
      invalidatesTags: ['ProfileSkill'] 
    }),
    listProfileJobroles: build.query<JobRoleDTO[], void>({ 
      query: () => '/api/me/profile/jobrole',
      keepUnusedDataFor: 0,
    }),
    addProfileJobrole: build.mutation<JobRoleDTO, AddUserJobroleDTO>({ 
      query: (body) => ({ url: '/api/me/profile/jobrole', method: 'POST', body }) 
    }),
    listProfileSkillsInJobrole: build.query<UserSkillSearchDto[], string>({ 
      query: (jobroleId) => `/api/me/profile/jobrole/${jobroleId}/skill`,
      keepUnusedDataFor: 0,
    }),
    removeProfileJobrole: build.mutation<void, string>({ 
      query: (jobroleId) => ({ url: `/api/me/profile/jobrole/${jobroleId}`, method: 'DELETE' }) 
    }),
    listProfileSkillConfirmations: build.query<ConfirmationDTO[], string>({ 
      query: (skillId) => `/api/me/profile/skill/${skillId}/confirmation`,
      keepUnusedDataFor: 0,
    }),
    addProfileSkillConfirmation: build.mutation<ConfirmationDTO, { skillId: string; body: ConfirmationDTO }>({
      query: ({ skillId, body }) => ({
        url: `/api/me/profile/skill/${skillId}/confirmation`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ProfileSkill', 'MyJobroleSkills', 'MySkills'],
    }),
    deleteProfileSkillConfirmation: build.mutation<void, { skillId: string; confirmationId: string }>({ 
      query: ({ skillId, confirmationId }) => ({ url: `/api/me/profile/skill/${skillId}/confirmation/${confirmationId}`, method: 'DELETE' }),
      invalidatesTags: ['ProfileSkill', 'MyJobroleSkills', 'MySkills'],
    }),

    // Current user data (without profile prefix)
    getMyJobroles: build.query<JobRoleDTO[], void>({
      query: () => '/api/me/jobrole',
      keepUnusedDataFor: 0,
    }),
    getMySkills: build.query<UserSkillSearchDto[], void>({
      query: () => '/api/me/skills',
      keepUnusedDataFor: 0,
    }),
    getMySkillsInJobrole: build.query<UserSkillSearchDto[], string>({
      query: (jobroleId) => `/api/me/jobrole/${jobroleId}/skills`,
      keepUnusedDataFor: 0,
    }),
    getMyServicedSkills: build.query<SkillWithCurrentVersionDTO[], void>({
      query: () => '/api/me/servicedSkills',
      keepUnusedDataFor: 0,
    }),

    // Permissions
    getMyPermissions: build.query<PermissionDTO[], void>({
      query: () => '/api/me/permissions',
      providesTags: ['MyPermissions'],
    }),
    getAllPermissions: build.query<PermissionDTO[], void>({
      query: () => '/api/permissions',
      providesTags: ['MyPermissions'],
    }),
    getUserPermissions: build.query<PermissionDTO[], string>({
      query: (userId) => `/api/user/${userId}/permissions`,
      providesTags: (_, __, userId) => [{ type: 'MyPermissions' as const, id: userId }],
    }),
    addUserPermission: build.mutation<void, { userId: string; permissionId: string }>({
      query: ({ userId, permissionId }) => ({
        url: `/api/user/${userId}/permissions`,
        method: 'POST',
        body: { permissionId }
      }),
      invalidatesTags: (_, __, { userId }) => [{ type: 'MyPermissions' as const, id: userId }],
    }),
    removeUserPermission: build.mutation<void, { userId: string; permissionId: string }>({
      query: ({ userId, permissionId }) => ({
        url: `/api/user/${userId}/permissions/${permissionId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_, __, { userId }) => [{ type: 'MyPermissions' as const, id: userId }],
    }),

    // Result preview for login popup (no caching; always refetch on demand)
    getUserResultPreview: build.query<UserResultPreviewDTO[], { query: string }>({
      query: ({ query }) => ({ url: '/api/user/getResultPreview', params: { query } }),
      keepUnusedDataFor: 0,
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRefreshMutation,
  useGetFileInfoQuery,
  useDownloadFileQuery,
  useUploadFileMutation,
  useConfirmFileAcknowledgmentMutation,
  useGetImageInfoQuery,
  useGetImageQuery,
  useUploadImageMutation,
  useSearchJobRolesQuery,
  useCreateJobRoleMutation,
  useGetJobRoleQuery,
  useUpdateJobRoleMutation,
  useDeleteJobRoleMutation,
  useListJobRoleUsersQuery,
  useAssignUserToJobRoleMutation,
  useUnassignUserFromJobRoleMutation,
  useListJobRoleSkillsQuery,
  useAddJobRoleSkillMutation,
  useUpdateJobRoleSkillMutation,
  useDeleteJobRoleSkillMutation,
  useSearchSkillsQuery,
  useCreateSkillMutation,
  useDeleteSkillMutation,
  useUpdateSkillMutation,
  useGetSkillQuery,
  useListSkillUsersQuery,
  useListAllSkillUsersQuery,
  useAddTagToSkillMutation,
  useGetSkillTagsQuery,
  useRemoveTagFromSkillMutation,
  useCreateSkillVersionMutation,
  useListSkillVersionsQuery,
  useGetSkillVersionQuery,
  useDeleteSkillVersionMutation,
  useUpdateSkillVersionMutation,
  useMakeRevisionMutation,
  useSearchTagsQuery,
  useGetTagQuery,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useCreateTagMutation,
  useCreateTestMutation,
  useStartTestMutation,
  useEndTestMutation,
  useSendAnswerMutation,
  useGetUserTestResultQuery,
  useGetTestResultQuery,
  useGetUserTestResultByUserQuery,
  useGetTestQuery,
  useGetTestFullQuery,
  useUpdateTestMutation,
  useGetCanDeleteTestQuery,
  useDeleteUserTestResultMutation,
  useSearchUsersQuery,
  useCreateUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useListUserSkillsQuery,
  useAddUserSkillMutation,
  useGetUserSkillQuery,
  useUpdateUserSkillTargetMutation,
  useDeleteUserSkillMutation,
  useListUserJobrolesQuery,
  useAddUserJobroleMutation,
  useListUserSkillsInJobroleQuery,
  useRemoveUserJobroleMutation,
  useListUserSkillConfirmationsQuery,
  useAddUserSkillConfirmationMutation,
  useDeleteUserSkillConfirmationMutation,
  // Profile hooks
  useGetProfileQuery,
  useGetProfileStatsQuery,
  useUpdateProfileMutation,
  useListProfileSkillsQuery,
  useAddProfileSkillMutation,
  useGetProfileSkillQuery,
  useUpdateProfileSkillTargetMutation,
  useDeleteProfileSkillMutation,
  useListProfileJobrolesQuery,
  useAddProfileJobroleMutation,
  useListProfileSkillsInJobroleQuery,
  useRemoveProfileJobroleMutation,
  useListProfileSkillConfirmationsQuery,
  useAddProfileSkillConfirmationMutation,
  useDeleteProfileSkillConfirmationMutation,
  // My data hooks
  useGetMyJobrolesQuery,
  useGetMySkillsQuery,
  useGetMySkillsInJobroleQuery,
  useGetMyServicedSkillsQuery,
  // Permissions hooks
  useGetMyPermissionsQuery,
  useGetAllPermissionsQuery,
  useGetUserPermissionsQuery,
  useAddUserPermissionMutation,
  useRemoveUserPermissionMutation,
  useGetAnalyticsKPIQuery: useGetAnalyticsKPIQuery,
  useGetAnalyticsJobRolesToSkillsQuery: useGetAnalyticsJobRolesToSkillsQuery,
  useGetAnalyticsJobRoleToSkillsQuery,
  useGetAnalyticsUserToSkillsQuery,
  useGetAnalyticsSkillToUsersQuery,
  useGetMySharedStatQuery,
  useDownloadAnalyticsKPIQuery,
  useDownloadAnalyticsJobRolesToSkillsQuery,
  useDownloadAnalyticsJobRoleToSkillsQuery,
  useDownloadAnalyticsUserToSkillsQuery,
  useDownloadAnalyticsSkillToUsersQuery,
  useDownloadMySharedStatQuery,
  useLazyDownloadAnalyticsUserToSkillsQuery,
  useLazyDownloadAnalyticsSkillToUsersQuery,
  useGetUserResultPreviewQuery,
  // Lazy download hooks
  useLazyDownloadAnalyticsKPIQuery,
  useLazyDownloadAnalyticsJobRolesToSkillsQuery,
  useLazyDownloadMySharedStatQuery,
} = api;
