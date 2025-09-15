import React from 'react';
import { Select, Flex, Space } from 'antd';
import PermissionButton from '@/components/shared/PermissionButton';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { TagDTO } from '@/types/api/tag';

interface TagSelectWithActionsProps {
  value?: string[];
  onChange?: (values: string[]) => void;
  tags: TagDTO[];
  onEditTag?: (tag: TagDTO) => void;
  onCreateTag?: () => void;
  remoteSearch?: boolean;
  onSearchChange?: (value: string) => void;
  loading?: boolean;
}

const TagSelectWithActions: React.FC<TagSelectWithActionsProps> = ({
  value,
  onChange,
  tags,
  onEditTag,
  onCreateTag,
  remoteSearch,
  onSearchChange,
  loading
}) => {
  const selectedTagIds = value || [];

  const handleChange = (values: string[]) => {
    onChange?.(values);
  };

  const handleEditTag = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    if (tag && onEditTag) {
      onEditTag(tag);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Select
        mode="multiple"
        placeholder="Выберите теги"
        value={selectedTagIds}
        onChange={handleChange}
        style={{ width: '100%' }}
        showSearch
        filterOption={remoteSearch ? false : undefined}
        onSearch={remoteSearch ? onSearchChange : undefined}
        loading={loading}
        notFoundContent={loading ? 'Загрузка...' : undefined}
        optionRender={(option) => (
          <Flex justify="space-between" align="center">
            <span>{option.label}</span>
            <PermissionButton
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleEditTag(option.value as string);
              }}
            />
          </Flex>
        )}
        options={tags.map(tag => ({
          value: tag.id,
          label: tag.name
        }))}
      />
      
  <PermissionButton
        type="dashed"
        icon={<PlusOutlined />}
        onClick={onCreateTag}
        style={{ width: '100%' }}
      >
        Создать тег
  </PermissionButton>
    </Space>
  );
};

export default TagSelectWithActions;
