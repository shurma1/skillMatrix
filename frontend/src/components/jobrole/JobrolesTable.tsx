import { Table } from 'antd';
import type { FC } from 'react';
import type { JobRoleDTO } from '@/types/api/jobrole';

interface JobrolesTableProps {
  data: JobRoleDTO[];
  loading?: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onRowClick: (jobRole: JobRoleDTO) => void;
}

const JobrolesTable: FC<JobrolesTableProps> = ({
  data,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onRowClick
}) => {
  const columns = [
    { 
      title: 'Название роли', 
      dataIndex: 'title'
    }
  ];

  return (
    <Table
      size="middle"
      rowKey={(jobRole) => jobRole.id}
      loading={loading}
      dataSource={data}
      pagination={{
        current: page,
        pageSize,
        total,
        onChange: onPageChange,
        showSizeChanger: true
      }}
      onRow={(record) => ({
        onClick: () => onRowClick(record),
        style: { cursor: 'pointer' }
      })}
      columns={columns}
    />
  );
};

export default JobrolesTable;
