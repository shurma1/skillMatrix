import React from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import UserAvatar from '@/components/user/UserAvatar';
import type { UserDTO } from '@/types/api/auth';

const { Text } = Typography;

interface UserCardProps {
  user: UserDTO;
  size?: 'small' | 'default' | 'large';
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  size = 'default'
}) => {
  const avatarSize = size === 'small' ? 32 : size === 'large' ? 64 : 40;
  const displayName = `${user.lastname || ''} ${user.firstname || ''} ${user.patronymic || ''}`.trim() || user.login || 'Неизвестный пользователь';

  return (
    <Link
      to={`/users/${user.id}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        textDecoration: 'none',
        color: 'inherit'
      }}
    >
      <UserAvatar
        user={user}
        size={avatarSize}
      />
      <Text style={{ fontSize: size === 'small' ? 12 : size === 'large' ? 16 : 14 }}>
        {displayName}
      </Text>
    </Link>
  );
};

export default UserCard;
