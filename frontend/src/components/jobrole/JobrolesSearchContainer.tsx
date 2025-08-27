import React, { useState, useEffect, useCallback } from 'react';
import { Flex, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchJobRolesQuery, useCreateJobRoleMutation } from '@/store/endpoints';
import type { CreateJobRoleDTO, JobRoleDTO } from '@/types/api/jobrole';
import JobrolesSearchPanel from './JobrolesSearchPanel';
import JobrolesTable from './JobrolesTable';
import CreateJobRoleModal from '../modals/jobrole/CreateJobRoleModal';

const JobrolesSearchContainer: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 600);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isFetching } = useSearchJobRolesQuery(
    {
      query: debouncedQuery || ' ',
      limit: pageSize,
      page
    },
    {
      skip: !debouncedQuery && debouncedQuery !== ''
    }
  );

  const [createJobRole, { isLoading: isCreating }] = useCreateJobRoleMutation();

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

  const handleCreate = async (values: CreateJobRoleDTO) => {
    try {
      const jobRole = await createJobRole(values).unwrap();
      message.success('Должность создана');
      setIsCreateOpen(false);
      navigate(`/jobroles/${jobRole.id}/`);
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? (error.data as { message?: string })?.message
        : 'Ошибка создания должности';
      message.error(errorMessage || 'Ошибка создания должности');
    }
  };

  const handleRowClick = useCallback(
    (jobRole: JobRoleDTO) => {
      navigate(`/jobroles/${jobRole.id}/`);
    },
    [navigate]
  );

  return (
    <Flex vertical>
      <Typography.Title
        level={3}
        style={{ marginTop: 0, marginBottom: 16 }}
      >
        Должности
      </Typography.Title>
      <JobrolesSearchPanel
        query={query}
        loading={isFetching}
        onQueryChange={setQuery}
        onCreateClick={() => setIsCreateOpen(true)}
      />
      <JobrolesTable
        data={data?.rows || []}
        loading={isFetching}
        total={data?.count || 0}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onRowClick={handleRowClick}
      />
      <CreateJobRoleModal
        open={isCreateOpen}
        confirmLoading={isCreating}
        onCancel={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </Flex>
  );
};

export default JobrolesSearchContainer;
