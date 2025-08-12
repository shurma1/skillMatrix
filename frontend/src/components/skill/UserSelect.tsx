import { Select, Avatar, Space } from 'antd';
import type { FC } from 'react';
import type { UserDTO } from '@/types/api/auth';
import { API_BASE_URL } from '@/config/api';

interface UserSelectProps {
  value: string[];
  loading?: boolean;
  placeholder: string;
  users: UserDTO[];
  onChange: (value: string[]) => void;
  style?: React.CSSProperties;
}

const UserSelect: FC<UserSelectProps> = ({
  value,
  loading,
  placeholder,
  users,
  onChange,
  style
}) => (
  <Select
    mode="multiple"
    allowClear
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    loading={loading}
    style={style}
    options={users.map(user => ({
      value: user.id,
      label: (
        <Space size={8}>
          <Avatar
            size={24}
            src={user.avatar_id
              ? `${API_BASE_URL}/api/image/${user.avatar_id}?thumb=true`
              : undefined
            }
          >
            {!user.avatar_id && (user.firstname?.[0] || user.login?.[0] || 'U')}
          </Avatar>
          <span>
            {`${user.lastname} ${user.firstname} ${user.patronymic || ''}`.trim()}
          </span>
        </Space>
      )
    }))}
  />
);

export default UserSelect;
