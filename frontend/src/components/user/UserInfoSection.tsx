import React from 'react';
import { Typography, Card, Button, Skeleton, Flex, Space } from 'antd';
import type { UserUpdateDTO } from '@/types/api/user';
import AvatarEditor from '../shared/AvatarEditor';
import PermissionButton from "@/components/shared/PermissionButton.tsx";

const { Title } = Typography;

interface UserInfoSectionProps {
  user: UserUpdateDTO | undefined;
  loading: boolean;
  initials: string;
  onEdit: () => void;
  onAvatarChange: (id: string) => void;
  onManagePermissions?: () => void;
  usePermissionButton?: boolean;
}

const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  user,
  loading,
  initials,
  onEdit,
  onAvatarChange,
  onManagePermissions,
  usePermissionButton = false
}) => (
  <div>
    <Title level={3} style={{ marginTop: 0 }}>
      Пользователь
    </Title>
    <Card>
      {loading || !user ? (
        <Skeleton active avatar paragraph={{ rows: 4 }} />
      ) : (
        <Flex gap={32} align="start">
          <AvatarEditor
            avatarId={user.avatar_id}
            initials={initials}
            onChange={onAvatarChange}
          />
          <div style={{ flex: 1 }}>
            <Flex
              justify="space-between"
              align="start"
              gap={16}
              style={{ width: '100%' }}
            >
              <div style={{ minWidth: 0 }}>
                <Title
                  level={4}
                  style={{ marginTop: 0, marginBottom: 8 }}
                >
                  {user.lastname} {user.firstname} {user.patronymic}
                </Title>
                <p style={{ margin: 0 }}>
                  <b>Логин:</b> {user.login}
                </p>
                <p style={{ margin: '4px 0 0' }}>
                  <b>Email:</b> {user.email || '—'}
                </p>
              </div>
              <Space>
                {onManagePermissions && (
                  <PermissionButton
                    requiredPermission="PERMISSION_MANAGE"
                    onClick={onManagePermissions}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Разрешения
                  </PermissionButton>
                )}
                {
                  usePermissionButton
                  ? <PermissionButton
                      type="primary"
                      onClick={onEdit}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Редактировать
                    </PermissionButton>
                  : <Button
                      type="primary"
                      onClick={onEdit}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Редактировать
                    </Button>
                }
              </Space>
            </Flex>
          </div>
        </Flex>
      )}
    </Card>
  </div>
);

export default UserInfoSection;
