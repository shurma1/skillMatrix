import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Space } from 'antd';
import {
  useGetJobRoleQuery,
  useListJobRoleSkillsQuery,
  useListJobRoleUsersQuery,
  useUpdateJobRoleMutation,
  useAddJobRoleSkillMutation,
  useUpdateJobRoleSkillMutation,
  useDeleteJobRoleSkillMutation,
  useAssignUserToJobRoleMutation,
  useUnassignUserFromJobRoleMutation,
  useSearchUsersQuery
} from '@/store/endpoints';
import type { UpdateJobRoleDTO } from '@/types/api/jobrole';
import JobRoleInfoCard from './JobRoleInfoCard';
import JobRoleSkillsCard from './JobRoleSkillsCard';
import JobRoleUsersCard from './JobRoleUsersCard';
import EditJobRoleModal from '../modals/jobrole/EditJobRoleModal';
import AddJobRoleSkillModal from '../modals/jobrole/AddJobRoleSkillModal';
import EditJobRoleSkillModal from '../modals/jobrole/EditJobRoleSkillModal';
import AssignUserToJobRoleModal from '../modals/jobrole/AssignUserToJobRoleModal';

const JobRoleContainer: React.FC = () => {
  const { jobroleId = '' } = useParams<{ jobroleId: string }>();
  const navigate = useNavigate();

  // Data queries
  const {
    data: jobRole,
    isFetching: isJobRoleLoading
  } = useGetJobRoleQuery(jobroleId, { skip: !jobroleId });

  const {
    data: jobRoleSkills = [],
    isFetching: isSkillsLoading,
    refetch: refetchSkills
  } = useListJobRoleSkillsQuery(jobroleId, { skip: !jobroleId });

  const {
    data: jobRoleUsers = [],
    isFetching: isUsersLoading,
    refetch: refetchUsers
  } = useListJobRoleUsersQuery(jobroleId, { skip: !jobroleId });

  const { data: allUsersSearch } = useSearchUsersQuery({ query: '' });

  // Mutations
  const [updateJobRole, { isLoading: isUpdating }] = useUpdateJobRoleMutation();
  const [addJobRoleSkill, { isLoading: isAddingSkill }] = useAddJobRoleSkillMutation();
  const [updateJobRoleSkill, { isLoading: isUpdatingSkill }] = useUpdateJobRoleSkillMutation();
  const [deleteJobRoleSkill, { isLoading: isRemovingSkill }] = useDeleteJobRoleSkillMutation();
  const [assignUserToJobRole, { isLoading: isAssigningUser }] = useAssignUserToJobRoleMutation();
  const [unassignUserFromJobRole, { isLoading: isUnassigningUser }] = useUnassignUserFromJobRoleMutation();

  // Modal states
  const [editOpen, setEditOpen] = useState(false);
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [assignUserOpen, setAssignUserOpen] = useState(false);
  const [editSkillData, setEditSkillData] = useState<{
    skillId: string;
    targetLevel: number;
  } | null>(null);

  // Computed values
  const existingSkillIds = jobRoleSkills.map(s => s.skillId);
  const existingUserIds = jobRoleUsers.map(u => u.userId);

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
  const handleUpdateJobRole = async (data: UpdateJobRoleDTO) => {
    try {
      await updateJobRole({ id: jobroleId, body: data }).unwrap();
      message.success('Должность обновлена');
      setEditOpen(false);
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка обновления');
    }
  };

  const handleAddSkill = async (skillId: string, targetLevel: number) => {
    try {
      await addJobRoleSkill({
        id: jobroleId,
        data: { skillId, targetLevel }
      }).unwrap();
      message.success('Навык добавлен');
      setAddSkillOpen(false);
      refetchSkills();
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка добавления');
    }
  };

  const handleUpdateSkill = async (targetLevel: number) => {
    if (!editSkillData) return;
    
    try {
      await updateJobRoleSkill({
        id: jobroleId,
        skillId: editSkillData.skillId,
        data: { targetLevel }
      }).unwrap();
      message.success('Уровень навыка обновлен');
      setEditSkillData(null);
      refetchSkills();
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка обновления');
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      await deleteJobRoleSkill({ id: jobroleId, skillId }).unwrap();
      message.success('Навык удален');
      refetchSkills();
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка удаления');
    }
  };

  const handleAssignUser = async (userId: string) => {
    try {
      await assignUserToJobRole({ id: jobroleId, userId }).unwrap();
      message.success('Пользователь назначен на должность');
      setAssignUserOpen(false);
      refetchUsers();
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка назначения');
    }
  };

  const handleUnassignUser = async (userId: string) => {
    try {
      await unassignUserFromJobRole({ id: jobroleId, userId }).unwrap();
      message.success('Пользователь удален из должности');
      refetchUsers();
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка удаления');
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleSkillClick = (skillId: string) => {
    navigate(`/skills/${skillId}`);
  };

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <JobRoleInfoCard
        jobRole={jobRole}
        loading={isJobRoleLoading}
        onEdit={() => setEditOpen(true)}
      />
      
      <JobRoleSkillsCard
        skills={jobRoleSkills}
        loading={isSkillsLoading || isRemovingSkill}
        onAdd={() => setAddSkillOpen(true)}
        onEdit={setEditSkillData}
        onRemove={handleRemoveSkill}
        onSkillClick={handleSkillClick}
      />
      
      <JobRoleUsersCard
        users={jobRoleUsers}
        loading={isUsersLoading || isUnassigningUser}
        onUserClick={handleUserClick}
        onAdd={() => setAssignUserOpen(true)}
        onRemove={handleUnassignUser}
      />

      <EditJobRoleModal
        open={editOpen}
        jobRole={jobRole || null}
        confirmLoading={isUpdating}
        onCancel={() => setEditOpen(false)}
        onSubmit={handleUpdateJobRole}
      />
      
      <AddJobRoleSkillModal
        open={addSkillOpen}
        disabledSkillIds={existingSkillIds}
        confirmLoading={isAddingSkill}
        onCancel={() => setAddSkillOpen(false)}
        onSubmit={handleAddSkill}
      />
      
      {editSkillData && (
        <EditJobRoleSkillModal
          open
          currentTargetLevel={editSkillData.targetLevel}
          confirmLoading={isUpdatingSkill}
          onCancel={() => setEditSkillData(null)}
          onSubmit={handleUpdateSkill}
        />
      )}
      
      <AssignUserToJobRoleModal
        open={assignUserOpen}
        users={allUsersSearch?.rows || []}
        disabledUserIds={existingUserIds}
        confirmLoading={isAssigningUser}
        onCancel={() => setAssignUserOpen(false)}
        onSubmit={handleAssignUser}
      />
    </Space>
  );
};

export default JobRoleContainer;
