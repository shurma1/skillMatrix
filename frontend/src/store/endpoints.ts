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
  CreateSkillVersionDTO
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
      providesTags: ['Profile'], // neutral tag; page is read-only
    }),
    getAnalyticsJobRolesToSkills: build.query<{
      left: { colLabels: string[]; data: (string | number | null)[][] };
      right: { colLabels: [string[], number[], number[]]; data: number[][] };
    }, void>({
      query: () => '/api/analytics/jobRolesToSkills',
      providesTags: ['Profile'],
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
      providesTags: ['Profile'],
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
      providesTags: (_, __, id) => [{ type: 'File' as const, id }],
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
      providesTags: (_, __, id) => [{ type: 'File' as const, id }],
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
      providesTags: (_, __, id) => [{ type: 'Image' as const, id }],
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
      providesTags: (_, _2, { id }) => [{ type: 'Image' as const, id }],
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
      providesTags: ['JobRole'],
    }),
    createJobRole: build.mutation<JobRoleDTO, CreateJobRoleDTO>({
      query: (body) => ({ url: '/api/jobrole', method: 'POST', body }),
      invalidatesTags: ['JobRole'],
    }),
    getJobRole: build.query<JobRoleDTO, string>({
      query: (id) => `/api/jobrole/${id}`,
      providesTags: (_, __, id) => [{ type: 'JobRole' as const, id }],
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
      providesTags: (_, __, id) => [{ type: 'JobRole' as const, id }],
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
      providesTags: (_, __, id) => [{ type: 'JobRoleSkill' as const, id }],
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
      }
    >({
      query: (params) => ({ url: '/api/skill/search', params }),
      providesTags: ['Skill'],
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
      providesTags: (_, __, id) => [{ type: 'SkillUsers' as const, id }]
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
      providesTags: ['Tag']
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
  // Avoid refetch to prevent flicker; cache is updated manually in UI
  invalidatesTags: [],
    }),
    listSkillVersions: build.query<SkillVersionDTO[], string>({
      query: (id) => `/api/skill/${id}/version`,
      providesTags: (_, __, id) => [{ type: 'SkillVersions' as const, id }]
    }),
    getSkillVersion: build.query<
      SkillVersionDTO,
      { id: string; versionId: string }
    >({
      query: ({ id, versionId }) => `/api/skill/${id}/version/${versionId}`
    }),
    deleteSkillVersion: build.mutation<
      void,
      { id: string; versionId: string }
    >({
      query: ({ id, versionId }) => ({
        url: `/api/skill/${id}/version/${versionId}`,
        method: 'DELETE'
      }),
  // We'll update cache manually to avoid global spinners
  invalidatesTags: [],
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
  // We'll update caches manually to avoid full list refetch and rerender
  invalidatesTags: [],
    }),

    // Tag
    searchTags: build.query<TagSearchDTO[], { query: string }>({
      query: (params) => ({ url: '/api/tag/search', params }),
      providesTags: ['Tag'],
    }),
    getTag: build.query<TagDTO, string>({
      query: (id) => `/api/tag/${id}`,
      providesTags: (_, __, id) => [{ type: 'Tag' as const, id }],
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
      invalidatesTags: ['Test'],
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
      providesTags: (_, __, testId) => [{ type: 'Test' as const, id: testId }],
    }),
    getTest: build.query<PreviewTestDto, string>({
      query: (testId) => `/api/test/${testId}`
    }),
    // User
    searchUsers: build.query<
      PaginatedResponse<UserDTO>,
      { query: string; limit?: number; page?: number }
    >({
      query: (params) => ({ url: '/api/user/search', params }),
      providesTags: ['User'],
    }),
    createUser: build.mutation<UserDTO, UserCreateDTO>({
      query: (body) => ({ url: '/api/user', method: 'POST', body }),
      invalidatesTags: ['User'],
    }),
    getUser: build.query<UserDTO, string>({
      query: (id) => `/api/user/${id}`,
      providesTags: (_, __, id) => [{ type: 'User' as const, id }],
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
      providesTags: (_, __, id) => [{ type: 'UserSkills' as const, id }]
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
      query: ({ id, skillId }) => `/api/user/${id}/skill/${skillId}`
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
      query: (id) => `/api/user/${id}/jobrole`
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
      providesTags: (_, __, { id, jobroleId }) => [
        { type: 'UserJobroleSkillsByJobrole' as const, id: `${id}_${jobroleId}` },
      ],
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
      query: ({ id, skillId }) => `/api/user/${id}/skill/${skillId}/confirmation`
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
      providesTags: ['Profile'],
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
      query: (skillId) => `/api/me/profile/skill/${skillId}` 
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
      query: () => '/api/me/profile/jobrole' 
    }),
    addProfileJobrole: build.mutation<JobRoleDTO, AddUserJobroleDTO>({ 
      query: (body) => ({ url: '/api/me/profile/jobrole', method: 'POST', body }) 
    }),
    listProfileSkillsInJobrole: build.query<UserSkillSearchDto[], string>({ 
      query: (jobroleId) => `/api/me/profile/jobrole/${jobroleId}/skill` 
    }),
    removeProfileJobrole: build.mutation<void, string>({ 
      query: (jobroleId) => ({ url: `/api/me/profile/jobrole/${jobroleId}`, method: 'DELETE' }) 
    }),
    listProfileSkillConfirmations: build.query<ConfirmationDTO[], string>({ 
      query: (skillId) => `/api/me/profile/skill/${skillId}/confirmation` 
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
      providesTags: ['MyJobroles'],
    }),
    getMySkills: build.query<UserSkillSearchDto[], void>({
      query: () => '/api/me/skills',
      providesTags: ['MySkills'],
    }),
    getMySkillsInJobrole: build.query<UserSkillSearchDto[], string>({
      query: (jobroleId) => `/api/me/jobrole/${jobroleId}/skills`,
      providesTags: (_, __, jobroleId) => [{ type: 'MyJobroleSkills' as const, id: jobroleId }],
    }),

    // Permissions
    getMyPermissions: build.query<PermissionDTO[], void>({
      query: () => '/api/me/permissions',
      providesTags: ['MyPermissions'],
    }),
    getAllPermissions: build.query<PermissionDTO[], void>({
      query: () => '/api/permissions',
      providesTags: ['Permission'],
    }),
    getUserPermissions: build.query<PermissionDTO[], string>({
      query: (userId) => `/api/user/${userId}/permissions`,
      providesTags: (_, __, userId) => [{ type: 'UserPermissions' as const, id: userId }],
    }),
    addUserPermission: build.mutation<void, { userId: string; permissionId: string }>({
      query: ({ userId, permissionId }) => ({
        url: `/api/user/${userId}/permissions`,
        method: 'POST',
        body: { permissionId }
      }),
      invalidatesTags: (_, __, { userId }) => [{ type: 'UserPermissions' as const, id: userId }],
    }),
    removeUserPermission: build.mutation<void, { userId: string; permissionId: string }>({
      query: ({ userId, permissionId }) => ({
        url: `/api/user/${userId}/permissions/${permissionId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_, __, { userId }) => [{ type: 'UserPermissions' as const, id: userId }],
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
  useAddTagToSkillMutation,
  useGetSkillTagsQuery,
  useRemoveTagFromSkillMutation,
  useCreateSkillVersionMutation,
  useListSkillVersionsQuery,
  useGetSkillVersionQuery,
  useDeleteSkillVersionMutation,
  useUpdateSkillVersionMutation,
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
  useGetTestQuery,
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
  // Permissions hooks
  useGetMyPermissionsQuery,
  useGetAllPermissionsQuery,
  useGetUserPermissionsQuery,
  useAddUserPermissionMutation,
  useRemoveUserPermissionMutation,
  useGetAnalyticsKPIQuery: useGetAnalyticsKPIQuery,
  useGetAnalyticsJobRolesToSkillsQuery: useGetAnalyticsJobRolesToSkillsQuery,
  useGetAnalyticsJobRoleToSkillsQuery,
  useGetUserResultPreviewQuery,
} = api;
