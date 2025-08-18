import { Table } from 'antd';
import type { FC } from 'react';
import type { UserDTO } from '@/types/api/auth';
import UserAvatar from '../shared/UserAvatar';

interface UsersTableProps {
  data: UserDTO[];
  loading?: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  onRowClick: (user: UserDTO) => void;
}

const UsersTable: FC<UsersTableProps> = ({
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
      title: '',
      dataIndex: 'avatar_id',
      width: 56,
      render: (_: string, user: UserDTO) => (
        <UserAvatar user={user} size={40} />
      )
    },
    { title: 'Фамилия', dataIndex: 'lastname' },
    { title: 'Имя', dataIndex: 'firstname' },
    { title: 'Отчество', dataIndex: 'patronymic' },
    { title: 'Логин', dataIndex: 'login' },
    { title: 'Email', dataIndex: 'email' },
  ];

  return (
    <Table
      size="middle"
      rowKey={(user) => user.id}
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
        onClick: () => onRowClick(record)
      })}
      columns={columns}
    />
  );
};

export default UsersTable;
