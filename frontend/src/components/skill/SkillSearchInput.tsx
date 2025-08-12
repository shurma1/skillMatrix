import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { FC } from 'react';

interface SkillSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SkillSearchInput: FC<SkillSearchInputProps> = ({
  value,
  onChange,
  placeholder
}) => (
  <Input
    allowClear
    placeholder={placeholder || 'Поиск навыков'}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    prefix={<SearchOutlined />}
    style={{ width: 240 }}
  />
);

export default SkillSearchInput;
