import React, { useMemo, useState } from 'react';
import { message, Space, Button, Popconfirm } from 'antd';
import { getUserInitials } from '@/utils/user';
import { useAppDispatch } from '@/hooks/storeHooks';
import { updateUserAvatar } from '@/store/authSlice';
import type { UserUpdateDTO } from '@/types/api/user';
import {
  useGetProfileQuery,
  useUpdateProfileMutation
} from '@/store/endpoints';
import EditUserModal from '../modals/user/EditUserModal';
import { authManager } from '@/utils/AuthManager';
import UserInfoSection from "@/components/user/UserInfoSection.tsx";

const ProfileContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  
  
  // Data queries
  const { data: user, isFetching: isUserLoading } = useGetProfileQuery();

  // Mutations
  const [updateProfile, { isLoading: isUpdatingUser }] = useUpdateProfileMutation();

  // Modal states
  const [editOpen, setEditOpen] = useState(false);

  // Computed values
  const initials = useMemo(() => user ? getUserInitials(user) : '', [user]);

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
  const handleUpdateProfile = async (data: UserUpdateDTO) => {
    try {
      await updateProfile(data).unwrap();
      
      // Если обновляется аватарка, обновляем её в auth store
      if (data.avatar_id) {
        dispatch(updateUserAvatar(data.avatar_id));
      }
      
      message.success('Изменения сохранены');
      setEditOpen(false);
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка обновления');
    }
  };

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      // authManager.forceLogout() уже выполняет:
      // 1. POST /api/auth/logout 
      // 2. localStorage.removeItem('auth')
      // 3. onLogout callback -> dispatch(logout())
      await authManager.forceLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Space direction="vertical" size={32} style={{ width: '100%' }}>
		<UserInfoSection
			user={user}
			loading={isUserLoading}
			initials={initials}
			onEdit={() => setEditOpen(true)}
			onAvatarChange={(avatar_id: string) => handleUpdateProfile({ avatar_id })}
		/>

      <div>
        <Popconfirm
          title="Выйти из аккаунта?"
          okText="Да"
            cancelText="Нет"
          onConfirm={handleLogout}
          disabled={isLoggingOut}
        >
          <Button danger loading={isLoggingOut}>Выйти</Button>
        </Popconfirm>
      </div>

      <EditUserModal
        open={editOpen}
        user={user || null}
        confirmLoading={isUpdatingUser}
        onCancel={() => setEditOpen(false)}
        onSubmit={handleUpdateProfile}
      />
    </Space>
  );
};

export default ProfileContainer;
