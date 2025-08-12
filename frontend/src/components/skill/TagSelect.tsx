import { Select } from 'antd';
import type { FC } from 'react';

interface Tag {
  id: string;
  name: string;
}

interface TagSelectProps {
  value: string[];
  loading?: boolean;
  placeholder: string;
  tags: Tag[];
  onChange: (value: string[]) => void;
  style?: React.CSSProperties;
}

const TagSelect: FC<TagSelectProps> = ({
  value,
  loading,
  placeholder,
  tags,
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
    options={tags.map(tag => ({
      value: tag.id,
      label: tag.name
    }))}
  />
);

export default TagSelect;
