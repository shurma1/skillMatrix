import React, { useState, useEffect, useCallback } from 'react';
import { Flex, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchUsersQuery, useCreateUserMutation } from '@/store/endpoints';
import type { UserCreateDTO } from '@/types/api/user';
import type { UserDTO } from '@/types/api/auth';
import UsersSearchPanel from './UsersSearchPanel';
import UsersTable from './UsersTable';
import CreateUserModal from './modals/CreateUserModal';

const UsersSearchContainer: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 600);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isFetching } = useSearchUsersQuery(
    {
      query: debouncedQuery || ' ',
      limit: pageSize,
      page
    },
    {
      skip: !debouncedQuery && debouncedQuery !== ''
    }
  );

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const handlePageChange = (
    newPage: number,
    newPageSize: number
  ) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleCreate = async (values: UserCreateDTO) => {
    try {
      const user = await createUser(values).unwrap();
      message.success('Пользователь создан');
      setIsCreateOpen(false);
      navigate(`/users/${user.id}/`);
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? (error.data as { message?: string })?.message
        : 'Ошибка создания пользователя';
      message.error(errorMessage || 'Ошибка создания пользователя');
    }
  };

  const handleRowClick = useCallback(
    (user: UserDTO) => {
      navigate(`/users/${user.id}/`);
    },
    [navigate]
  );

  return (
    <Flex vertical>
      <Typography.Title
        level={3}
        style={{ marginTop: 0, marginBottom: 16 }}
      >
        Пользователи
      </Typography.Title>
      <UsersSearchPanel
        query={query}
        loading={isFetching}
        onQueryChange={setQuery}
        onCreateClick={() => setIsCreateOpen(true)}
      />
      <UsersTable
        data={data?.rows || []}
        loading={isFetching}
        total={data?.count || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onRowClick={handleRowClick}
      />
      <CreateUserModal
        open={isCreateOpen}
        confirmLoading={isCreating}
        onCancel={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </Flex>
  );
};

export default UsersSearchContainer;
