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
  UserUpdateDTO
} from '../types/api/user';
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

export const api = baseApi.injectEndpoints({
  endpoints: (build) => ({
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
      providesTags: ['UserSkill']
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
      invalidatesTags: (_, __, { id }) => [{ type: 'Skill' as const, id }],
    }),
    listSkillVersions: build.query<SkillVersionDTO[], string>({
      query: (id) => `/api/skill/${id}/version`,
      providesTags: ['Skill']
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
      invalidatesTags: (_, __, { id }) => [{ type: 'Skill' as const, id }],
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
      providesTags: ['UserSkill']
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
      invalidatesTags: ['UserSkill']
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
      invalidatesTags: ['UserSkill']
    }),
    deleteUserSkill: build.mutation<
      void,
      { id: string; skillId: string }
    >({
      query: ({ id, skillId }) => ({
        url: `/api/user/${id}/skill/${skillId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['UserSkill']
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
      query: ({ id, jobroleId }) => `/api/user/${id}/jobrole/${jobroleId}/skill`
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
    }),
    deleteUserSkillConfirmation: build.mutation<void, { id: string; skillId: string; confirmationId: string }>({ query: ({ id, skillId, confirmationId })=> ({ url: `/api/user/${id}/skill/${skillId}/confirmation/${confirmationId}`, method: 'DELETE' }) }),

    // Profile (current user)
    getProfile: build.query<UserDTO, void>({
      query: () => '/api/me/profile',
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
      invalidatesTags: ['ProfileSkill'] 
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
    }),
    deleteProfileSkillConfirmation: build.mutation<void, { skillId: string; confirmationId: string }>({ 
      query: ({ skillId, confirmationId }) => ({ url: `/api/me/profile/skill/${skillId}/confirmation/${confirmationId}`, method: 'DELETE' }) 
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
} = api;
