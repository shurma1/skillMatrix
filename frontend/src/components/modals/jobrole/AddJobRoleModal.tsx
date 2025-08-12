import React from 'react';
import type { JobRoleDTO } from '@/types/api/jobrole';
import SelectEntityModal from '../shared/SelectEntityModal';

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
}) => (
  <SelectEntityModal
    open={open}
    title="Добавить должность"
    okText="Добавить"
    fieldLabel="Должность"
    options={options.map(j => ({
      value: j.id,
      label: j.title,
      disabled: disabledIds.includes(j.id)
    }))}
    onCancel={onCancel}
    confirmLoading={confirmLoading}
    onSubmit={(id) => onSubmit(id)}
  />
);

export default AddJobRoleModal;
