import { Input, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { FC } from 'react';

interface UserSearchInputProps {
  value: string;
  loading?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
}

const UserSearchInput: FC<UserSearchInputProps> = ({
  value,
  onChange,
  loading,
  placeholder
}) => (
  <Input
    allowClear
    value={value}
    placeholder={placeholder || 'Поиск (ФИО / логин / email)'}
    onChange={(e) => onChange(e.target.value)}
    prefix={<SearchOutlined style={{ color: '#999' }} />}
    suffix={loading ? <Spin size="small" /> : undefined}
  />
);

export default UserSearchInput;
