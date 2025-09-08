import { Table, Tag, Space } from 'antd';
import type { FC } from 'react';
import type { SkillWithCurrentVersionDTO } from '@/types/api/skill';
import type { TagDTO } from '@/types/api/tag';
import { getSkillAuditStyle } from '@/utils/skillAuditHelpers';
import { useAppSelector } from '@/hooks/storeHooks';

interface SkillsTableProps {
  skills: SkillWithCurrentVersionDTO[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onRowClick: (skill: SkillWithCurrentVersionDTO) => void;
}

const SkillsTable: FC<SkillsTableProps> = ({
  skills,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onRowClick
}) => {
  const isDark = useAppSelector(s => s.theme.isDark);
  const columns = [
    {
      title: 'Номер документ',
      dataIndex: 'documentId',
      key: 'documentId',
      render: (value: string) => value || '-'
    },
    { title: 'Название', dataIndex: 'title', key: 'title' },
    { title: 'Тип', dataIndex: 'type', key: 'type', render: (value: string) => value === 'skill' ? 'Навык' : 'Документ' },
    {
      title: 'Дата утверждения',
      dataIndex: 'approvedDate',
      key: 'approvedDate',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : '-'
    },
    {
      title: 'Дата ревизии',
      dataIndex: 'auditDate',
      key: 'auditDate',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : '-'
    },
    { title: 'Версия', dataIndex: 'version', key: 'version' },
    {
      title: 'Теги',
      dataIndex: 'tags',
      key: 'tags',
      render: (tagList: TagDTO[]) => (
        <Space size={[4, 4]} wrap>
          {tagList.map(tag => (
            <Tag key={tag.id}>{tag.name}</Tag>
          ))}
        </Space>
      )
    },
  ];

  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={skills}
      columns={columns}
      onRow={(record) => ({
        onClick: () => onRowClick(record),
    style: getSkillAuditStyle(record.auditDate, {}, { isDark })
      })}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        onChange: onPageChange
      }}
    />
  );
};

export default SkillsTable;
