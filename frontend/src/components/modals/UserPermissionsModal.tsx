import React, { useState } from 'react';
import {
  Modal,
  Button,
  Switch,
  Spin,
  Alert,
  Space,
  Typography,
  Card,
} from 'antd';
import {
  useGetAllPermissionsQuery,
  useGetUserPermissionsQuery,
  useAddUserPermissionMutation,
  useRemoveUserPermissionMutation,
} from '../../store/endpoints';
import { useAppSelector } from '../../hooks/storeHooks';
import type { PermissionDTO } from '../../types/api/permission';

const { Text } = Typography;

interface UserPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export const UserPermissionsModal: React.FC<UserPermissionsModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
}) => {
  const [loadingPermissions, setLoadingPermissions] = useState<Set<string>>(new Set());
  
  // Получаем текущего пользователя из store
  const currentUser = useAppSelector(state => state.auth.user);
  const isEditingSelf = currentUser && String(currentUser.id) === userId;

  const {
    data: allPermissions,
    isLoading: isLoadingAllPermissions,
    error: allPermissionsError,
  } = useGetAllPermissionsQuery();

  const {
    data: userPermissions,
    isLoading: isLoadingUserPermissions,
    error: userPermissionsError,
  } = useGetUserPermissionsQuery(userId);

  const [addPermission] = useAddUserPermissionMutation();
  const [removePermission] = useRemoveUserPermissionMutation();

  const handlePermissionToggle = async (permission: PermissionDTO, isEnabled: boolean) => {
    // Запрещаем отключение разрешений для самого себя
    if (isEditingSelf && !isEnabled) {
      return;
    }

    setLoadingPermissions(prev => new Set(prev).add(permission.id));

    try {
      if (isEnabled) {
        await addPermission({ userId, permissionId: permission.id }).unwrap();
      } else {
        await removePermission({ userId, permissionId: permission.id }).unwrap();
      }
    } catch (error) {
      console.error('Error toggling permission:', error);
    } finally {
      setLoadingPermissions(prev => {
        const newSet = new Set(prev);
        newSet.delete(permission.id);
        return newSet;
      });
    }
  };

  const isPermissionEnabled = (permissionId: string) => {
    return userPermissions?.some(p => p.id === permissionId) || false;
  };

  const isPermissionDisabled = (permission: PermissionDTO) => {
    const isToggling = loadingPermissions.has(permission.id);
    const isEnabled = isPermissionEnabled(permission.id);
    
    // Если редактируем себя и разрешение включено - запрещаем отключение
    if (isEditingSelf && isEnabled) {
      return true;
    }
    
    return isToggling;
  };

  const isLoading = isLoadingAllPermissions || isLoadingUserPermissions;
  const hasError = allPermissionsError || userPermissionsError;

  return (
    <Modal
      title={`Разрешения пользователя: ${userName}${isEditingSelf ? ' (вы редактируете свои разрешения)' : ''}`}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Закрыть
        </Button>,
      ]}
      width={700}
    >
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
        </div>
      )}
      
      {hasError && (
        <Alert
          message="Ошибка при загрузке разрешений"
          type="error"
          style={{ marginBottom: 16 }}
        />
      )}
      
      {isEditingSelf && (
        <Alert
          message="Вы редактируете свои собственные разрешения. Включенные разрешения нельзя отключить для предотвращения блокировки доступа."
          type="info"
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}
      
      {!isLoading && !hasError && allPermissions && (
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {allPermissions.map((permission) => {
              const isEnabled = isPermissionEnabled(permission.id);
              const isToggling = loadingPermissions.has(permission.id);
              const isDisabled = isPermissionDisabled(permission);
              
              return (
                <Card key={permission.id} size="small" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ marginBottom: '4px' }}>
                        <Text strong style={{ 
                          display: 'block', 
                          fontSize: '14px',
                          lineHeight: '1.4',
                          color: isDisabled && isEnabled ? '#bfbfbf' : undefined
                        }}>
                          {permission.name}
                          {isEditingSelf && isEnabled && (
                            <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
                              (нельзя отключить)
                            </Text>
                          )}
                        </Text>
                      </div>
                      <div>
                        <Text type="secondary" style={{ 
                          fontSize: '12px', 
                          display: 'block',
                          lineHeight: '1.3',
                          wordBreak: 'break-word',
                          color: isDisabled && isEnabled ? '#d9d9d9' : undefined
                        }}>
                          {permission.description}
                        </Text>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      flexShrink: 0,
                      paddingTop: '2px'
                    }}>
                      {isToggling && <Spin size="small" />}
                      <Switch
                        checked={isEnabled}
                        disabled={isDisabled}
                        onChange={(checked) => handlePermissionToggle(permission, checked)}
                        size="default"
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
            
            {allPermissions.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Text type="secondary">Разрешения не найдены</Text>
              </div>
            )}
          </Space>
        </div>
      )}
    </Modal>
  );
};
