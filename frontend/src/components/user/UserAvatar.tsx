import { Avatar, Spin, Tooltip } from 'antd';
import type { FC } from 'react';
import { useGetImageQuery } from '@/store/endpoints';
import type { UserDTO } from '@/types/api/auth';
import { useEffect, useMemo, useState } from 'react';

interface UserAvatarProps {
  user: UserDTO;
  size?: number;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, size = 40 }) => {
  const avatarId = user.avatar_id || undefined;
  const { data: blob, isFetching } = useGetImageQuery(
    { id: avatarId as string, thumb: true },
    { skip: !avatarId }
  );
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setObjectUrl(null);
  }, [blob]);

  const initials = useMemo(() => {
    const parts = [user.lastname, user.firstname, user.patronymic].filter(Boolean);
    if (!parts.length) return user.login.slice(0, 2).toUpperCase();
    return parts.map(p => p[0]).join('').slice(0, 2).toUpperCase();
  }, [user]);

  if (!avatarId) {
    return <Avatar size={size}>{initials}</Avatar>;
  }

  return (
    <Tooltip title={`${user.lastname} ${user.firstname}`.trim()}>
      <Avatar size={size} src={objectUrl || undefined}>
        {isFetching ? <Spin size="small" /> : initials}
      </Avatar>
    </Tooltip>
  );
};

export default UserAvatar;
