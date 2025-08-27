import React from 'react';
import { Card, Table, Button, Popconfirm } from 'antd';
import PermissionButton from '@/components/shared/PermissionButton';
import { PlusOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import type { JobRoleUserSearchDTO } from '@/types/api/jobrole';
import UserAvatar from '../shared/UserAvatar';

interface JobRoleUsersCardProps {
  users: JobRoleUserSearchDTO[];
  loading: boolean;
  onUserClick: (userId: string) => void;
  onAdd: () => void;
  onRemove: (userId: string) => void;
}

const JobRoleUsersCard: React.FC<JobRoleUsersCardProps> = ({
  users,
  loading,
  onUserClick,
  onAdd,
  onRemove
}) => {
  const columns = [
    {
      title: '',
      dataIndex: 'avatarId',
      width: 56,
      render: (_: unknown, user: JobRoleUserSearchDTO) => (
        <UserAvatar
          user={{
            id: user.userId,
            login: user.login,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            patronymic: user.patronymic,
            avatar_id: user.avatarId
          }}
          size={40}
        />
      )
    },
    {
      title: 'Фамилия',
      dataIndex: 'lastname',
    },
    {
      title: 'Имя',
      dataIndex: 'firstname'
    },
    {
      title: 'Отчество',
      dataIndex: 'patronymic'
    },
    {
      title: 'Логин',
      dataIndex: 'login'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Назначена',
      dataIndex: 'assignedAt',
      render: (date: string) => new Date(date).toLocaleDateString('ru-RU')
    },
    {
      title: 'Действия',
      key: 'actions',
	  align: 'center' as const,
      render: (_: unknown, record: JobRoleUserSearchDTO) => (
        <Popconfirm
          title="Удалить пользователя из должности?"
          description="Вы уверены, что хотите удалить этого пользователя из должности?"
          onConfirm={() => onRemove(record.userId)}
          okText="Да"
          cancelText="Нет"
        >
          <PermissionButton
            type="text"
            danger
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      )
    },
	{
		  title: 'Перейти',
		  key: 'go',
		  align: 'center' as const,
		  render: (_: unknown, record: JobRoleUserSearchDTO) => (
			  <Button
				  type="text"
				  
				  icon={<LinkOutlined />}
				  onClick={() => onUserClick(record.userId)}
			  />
		  )
	},
  ];

  return (
    <Card
      title="Пользователи с этой должностью"
      extra={
        <PermissionButton
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
        >
          Добавить пользователя
        </PermissionButton>
      }
    >
      <Table
        dataSource={users}
        columns={columns}
        loading={loading}
        rowKey="userId"
        pagination={{
          pageSize: 10,
          showSizeChanger: true
        }}
      />
    </Card>
  );
};

export default JobRoleUsersCard;
