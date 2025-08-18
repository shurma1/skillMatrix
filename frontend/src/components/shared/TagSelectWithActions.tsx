import React, { useState } from 'react';
import { Select, Button, Flex, Space } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { TagDTO } from '@/types/api/tag';

interface TagSelectWithActionsProps {
  value?: string[];
  onChange?: (values: string[]) => void;
  tags: TagDTO[];
  onEditTag?: (tag: TagDTO) => void;
  onCreateTag?: () => void;
}

const TagSelectWithActions: React.FC<TagSelectWithActionsProps> = ({
  value,
  onChange,
  tags,
  onEditTag,
  onCreateTag
}) => {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(value || []);

  const handleChange = (values: string[]) => {
    setSelectedTagIds(values);
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
        optionRender={(option) => (
          <Flex justify="space-between" align="center">
            <span>{option.label}</span>
            <Button
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
      
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={onCreateTag}
        style={{ width: '100%' }}
      >
        Создать тег
      </Button>
    </Space>
  );
};

export default TagSelectWithActions;
