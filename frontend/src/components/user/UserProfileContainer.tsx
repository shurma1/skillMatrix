import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { message, Space } from 'antd';
import { getUserInitials } from '@/utils/user';
import { useAppSelector, useAppDispatch } from '@/hooks/storeHooks';
import { updateUserAvatar } from '@/store/authSlice';
import type { UserUpdateDTO } from '@/types/api/user';
import {
  useGetUserQuery,
  useUpdateUserMutation,
  useListUserJobrolesQuery,
  useListUserSkillsQuery,
  useAddUserJobroleMutation,
  useAddUserSkillMutation,
  useSearchSkillsQuery,
  useSearchJobRolesQuery,
  useUpdateUserSkillTargetMutation,
  useRemoveUserJobroleMutation,
  useDeleteUserSkillMutation
} from '@/store/endpoints';
import UserInfoSection from './UserInfoSection';
import UserJobRolesSection from '../jobrole/UserJobRolesSection';
import UserSkillsSection from '../skill/UserSkillsSection';
import JobRoleSkillsList from '../jobrole/JobRoleSkillsList';
import EditUserModal from '../modals/user/EditUserModal';
import AddJobRoleModal from '../modals/jobrole/AddJobRoleModal';
import AddSkillModal from '../modals/skill/AddSkillModal';
import UpdateUserSkillTargetModal from '../modals/skill/UpdateUserSkillTargetModal';

type AnyJobrole = { id?: string; jobRoleId?: string; title: string };

const hasId = (jr: unknown): jr is { id: string } =>
  typeof jr === 'object' && jr !== null && 'id' in jr && typeof (jr as { id: unknown }).id === 'string';
const hasJobRoleId = (jr: unknown): jr is { jobRoleId: string } =>
  typeof jr === 'object' && jr !== null && 'jobRoleId' in jr && typeof (jr as { jobRoleId: unknown }).jobRoleId === 'string';

const normalizeJobroleId = (jr: unknown): string => {
  if (hasId(jr)) return jr.id;
  if (hasJobRoleId(jr)) return jr.jobRoleId;
  return '';
};

const UserProfileContainer: React.FC = () => {
  const { userId = '' } = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.user);
  
  // Data queries
  const { data: user, isFetching: isUserLoading } = useGetUserQuery(
    userId,
    { skip: !userId }
  );
  const {
    data: userJobroles = [],
    isFetching: isJobrolesLoading,
    refetch: refetchJobroles
  } = useListUserJobrolesQuery(userId, { skip: !userId });
  const {
    data: userSkills = [],
    isFetching: isSkillsLoading,
    refetch: refetchSkills
  } = useListUserSkillsQuery(userId, { skip: !userId });
  const { data: allSkillsSearch } = useSearchSkillsQuery({ query: '' });
  const { data: allJobrolesSearch } = useSearchJobRolesQuery({ query: '' });

  // Mutations
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [addUserJobrole, { isLoading: isAddingJobrole }] = useAddUserJobroleMutation();
  const [addUserSkill, { isLoading: isAddingSkill }] = useAddUserSkillMutation();
  const [removeUserJobrole] = useRemoveUserJobroleMutation();
  const [deleteUserSkill] = useDeleteUserSkillMutation();
  const [updateUserSkillTarget, { isLoading: isUpdatingSkillTarget }] = useUpdateUserSkillTargetMutation();

  // Modal states
  const [editOpen, setEditOpen] = useState(false);
  const [addJobroleOpen, setAddJobroleOpen] = useState(false);
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [editSkillTarget, setEditSkillTarget] = useState<{
    skillId: string;
    targetLevel: number;
  } | null>(null);

  // Computed values
  const initials = useMemo(() => user ? getUserInitials(user) : '', [user]);
  const existingSkillIds = userSkills.map(s => s.skillId);
  const existingJobroleIds = userJobroles
    .map(j => normalizeJobroleId(j))
    .filter(Boolean);

  // Error handling utility
  const extractErrMessage = (error: unknown): string => {
    if (
      typeof error === 'object' &&
      error &&
      'data' in error &&
      typeof (error as { data?: { message?: string } }).data?.message === 'string'
    ) {
      return (error as { data: { message: string } }).data.message;
    }
    return 'Ошибка';
  };

  // Event handlers
  const handleUpdateUser = async (data: UserUpdateDTO) => {
    try {
      await updateUser({ id: userId, body: data }).unwrap();
      message.success('Изменения сохранены');
      setEditOpen(false);
      
      // Если обновляется аватар самого пользователя, обновляем сессию
  if (data.avatar_id && currentUser && String(currentUser.id) === userId) {
        dispatch(updateUserAvatar(data.avatar_id));
      }
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка обновления');
    }
  };

  const handleAddJobrole = async (jobRoleId: string) => {
    try {
      await addUserJobrole({ id: userId, body: { jobRoleId } }).unwrap();
      message.success('Должность добавлена');
      setAddJobroleOpen(false);
      refetchJobroles();
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка добавления');
    }
  };

  const handleAddSkill = async (skillId: string, targetLevel: number) => {
    try {
      await addUserSkill({ id: userId, body: { skillId, targetLevel } }).unwrap();
      message.success('Навык добавлен');
      setAddSkillOpen(false);
      refetchSkills();
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка добавления');
    }
  };

  const handleDeleteJobrole = async (jobroleId: string) => {
    try {
      await removeUserJobrole({ id: userId, jobroleId }).unwrap();
      message.success('Должность удалена');
      refetchJobroles();
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка удаления');
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      await deleteUserSkill({ id: userId, skillId }).unwrap();
      message.success('Навык удален');
      refetchSkills();
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка удаления');
    }
  };

  const handleUpdateSkillTarget = async (targetLevel: number) => {
    if (!editSkillTarget) return;
    
    try {
      await updateUserSkillTarget({
        id: userId,
        skillId: editSkillTarget.skillId,
        body: { targetLevel }
      }).unwrap();
      message.success('Цель обновлена');
      setEditSkillTarget(null);
      refetchSkills();
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? (error.data as { message?: string })?.message
        : 'Ошибка обновления';
      message.error(errorMessage || 'Ошибка обновления');
    }
  };

  const renderJobRoleSkills = (userId: string, jobroleId: string) => (
    <JobRoleSkillsList userId={userId} jobroleId={jobroleId} />
  );

  return (
    <Space direction="vertical" size={32} style={{ width: '100%' }}>
      <UserInfoSection
        user={user}
        loading={isUserLoading}
        initials={initials}
        onEdit={() => setEditOpen(true)}
        onAvatarChange={(avatar_id) => handleUpdateUser({ avatar_id })}
      />
      
      <UserJobRolesSection
        jobroles={userJobroles}
        loading={isJobrolesLoading}
        onAdd={() => setAddJobroleOpen(true)}
        onDelete={handleDeleteJobrole}
        userId={userId}
        jobRoleSkillsComponent={renderJobRoleSkills}
      />
      
      <UserSkillsSection
        skills={userSkills}
        loading={isSkillsLoading}
        userId={userId}
        onAdd={() => setAddSkillOpen(true)}
        onDelete={handleDeleteSkill}
        onEditTarget={setEditSkillTarget}
      />

      <EditUserModal
        open={editOpen}
        user={user || null}
        confirmLoading={isUpdatingUser}
        onCancel={() => setEditOpen(false)}
        onSubmit={handleUpdateUser}
      />
      
      <AddJobRoleModal
        open={addJobroleOpen}
        options={allJobrolesSearch?.rows || []}
        disabledIds={existingJobroleIds}
        confirmLoading={isAddingJobrole}
        onCancel={() => setAddJobroleOpen(false)}
        onSubmit={handleAddJobrole}
      />
      
      <AddSkillModal
        open={addSkillOpen}
        options={allSkillsSearch?.rows || []}
        disabledIds={existingSkillIds}
        confirmLoading={isAddingSkill}
        onCancel={() => setAddSkillOpen(false)}
        onSubmit={handleAddSkill}
      />
      
      {editSkillTarget && (
        <UpdateUserSkillTargetModal
          open
          currentTarget={editSkillTarget.targetLevel}
          onCancel={() => setEditSkillTarget(null)}
          confirmLoading={isUpdatingSkillTarget}
          onSubmit={handleUpdateSkillTarget}
        />
      )}
    </Space>
  );
};

export default UserProfileContainer;
