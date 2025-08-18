import { Input, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { FC } from 'react';

interface JobRoleSearchInputProps {
  value: string;
  loading?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
}

const JobRoleSearchInput: FC<JobRoleSearchInputProps> = ({
  value,
  onChange,
  loading,
  placeholder
}) => (
  <Input
    allowClear
    value={value}
    placeholder={placeholder || 'Поиск ролей по названию'}
    onChange={(e) => onChange(e.target.value)}
    prefix={<SearchOutlined style={{ color: '#999' }} />}
    suffix={loading ? <Spin size="small" /> : undefined}
  />
);

export default JobRoleSearchInput;
