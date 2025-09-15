import React, { useState } from 'react';
import type { JobRoleDTO } from '@/types/api/jobrole';
import SelectEntityModal from '../shared/SelectEntityModal';
import { useSearchJobRolesQuery } from '@/store/endpoints';
import { useDebounce } from '@/hooks/useDebounce';

interface AddJobRoleModalProps {
  open: boolean;
  options: JobRoleDTO[];
  disabledIds: string[];
  confirmLoading?: boolean;
  onCancel: () => void;
  onSubmit: (jobRoleId: string) => void;
}

const AddJobRoleModal: React.FC<AddJobRoleModalProps> = ({
  open,
  options,
  disabledIds,
  confirmLoading,
  onCancel,
  onSubmit
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const { data, isFetching } = useSearchJobRolesQuery({ query: debouncedQuery });

  const remoteRows = (data?.rows || []).length ? data?.rows : [];
  // fallback to provided options when no search yet
  const base = debouncedQuery ? remoteRows : options;
  const mapped = (base || []).map(j => ({
    value: j.id,
    label: j.title,
    disabled: disabledIds.includes(j.id)
  }));

  return (
    <SelectEntityModal
      open={open}
      title="Добавить должность"
      okText="Добавить"
      fieldLabel="Должность"
      options={mapped}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      onSubmit={(id) => onSubmit(id)}
      remoteSearch
      onSearchChange={(v) => setQuery(v)}
      searchLoading={isFetching}
    />
  );
};

export default AddJobRoleModal;
