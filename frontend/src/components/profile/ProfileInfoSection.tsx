import React from 'react';
import { Typography, Card, Button, Skeleton, Flex } from 'antd';
import type { UserUpdateDTO } from '@/types/api/user';
import AvatarEditor from '../shared/AvatarEditor';

const { Title } = Typography;

interface ProfileInfoSectionProps {
  user: UserUpdateDTO | undefined;
  loading: boolean;
  initials: string;
  onEdit: () => void;
  onAvatarChange: (id: string) => void;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
  user,
  loading,
  initials,
  onEdit,
  onAvatarChange
}) => (
  <div>
    <Title level={3} style={{ marginTop: 0 }}>
      Мой профиль
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
              <Button
                type="primary"
                onClick={onEdit}
                style={{ whiteSpace: 'nowrap' }}
              >
                Редактировать
              </Button>
            </Flex>
          </div>
        </Flex>
      )}
    </Card>
  </div>
);

export default ProfileInfoSection;
