import React from 'react';
import { Card, Table, Button, Space, Tag, Popconfirm } from 'antd';
import PermissionButton from '@/components/shared/PermissionButton';
import {PlusOutlined, EditOutlined, DeleteOutlined, LinkOutlined} from '@ant-design/icons';
import type {JobRoleSkillSearchDTO} from '@/types/api/jobrole';

interface JobRoleSkillsCardProps {
  skills: JobRoleSkillSearchDTO[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (data: { skillId: string; targetLevel: number }) => void;
  onRemove: (skillId: string) => void;
  onSkillClick: (skillId: string) => void;
}

const JobRoleSkillsCard: React.FC<JobRoleSkillsCardProps> = ({
  skills,
  loading,
  onAdd,
  onEdit,
  onRemove,
  onSkillClick
}) => {
  const columns = [
    {
      title: 'Название',
      dataIndex: 'title',
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      render: (type: string) => (
        <Tag color={type === 'document' ? 'blue' : 'green'}>
          {type === 'document' ? 'Документ' : 'Навык'}
        </Tag>
      )
    },
    {
      title: 'Теги',
      dataIndex: 'tags',
      render: (tags: Array<{ id: string; name: string }>) => (
        <Space wrap>
          {tags.map(tag => (
            <Tag key={tag.id} color="default">
              {tag.name}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'Целевой уровень',
      dataIndex: 'targetLevel',
      render: (level: number) => (
        <Tag color="orange">{level}</Tag>
      )
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: JobRoleSkillSearchDTO) => (
        <Space>
          <PermissionButton
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit({
              skillId: record.skillId,
              targetLevel: record.targetLevel
            })}
          />
          <Popconfirm
            title="Удалить навык?"
            description="Вы уверены, что хотите удалить этот навык из должности?"
            onConfirm={() => onRemove(record.skillId)}
            okText="Да"
            cancelText="Нет"
          >
            <PermissionButton
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    },
	{
		  title: 'Перейти',
		  key: 'go',
		  align: 'center' as const,
		  render: (_: unknown, record: JobRoleSkillSearchDTO) => (
			  <Button
				  type="text"
				  
				  icon={<LinkOutlined />}
				  onClick={() => onSkillClick(record.skillId)}
			  />
		  )
	},
  ];

  return (
    <Card
      title="Навыки должности"
      extra={
  <PermissionButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
  >
          Добавить навык
  </PermissionButton>
      }
    >
      <Table
        dataSource={skills}
        columns={columns}
        loading={loading}
        rowKey="skillId"
        pagination={{
          pageSize: 10,
          showSizeChanger: true
        }}
      />
    </Card>
  );
};

export default JobRoleSkillsCard;
