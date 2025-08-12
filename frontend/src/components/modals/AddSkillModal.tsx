import React from 'react';
import type { SkillWithCurrentVersionDTO } from '@/types/api/skill';
import SelectEntityModal from './SelectEntityModal';

interface AddSkillModalProps {
  open: boolean;
  options: SkillWithCurrentVersionDTO[];
  disabledIds: string[];
  confirmLoading?: boolean;
  onCancel: () => void;
  onSubmit: (skillId: string, targetLevel: number) => void;
}

const AddSkillModal: React.FC<AddSkillModalProps> = ({
  open,
  options,
  disabledIds,
  confirmLoading,
  onCancel,
  onSubmit
}) => {
  const safeOptions = Array.isArray(options) ? options : [];
  
  return (
    <SelectEntityModal
      open={open}
      title="Добавить навык"
      okText="Добавить"
      fieldLabel="Навык"
      mode="withNumber"
      numberFieldLabel="Целевой уровень"
      numberInitial={1}
      options={safeOptions.map(s => ({
        value: s.id,
        label: s.title,
        disabled: disabledIds.includes(s.id)
      }))}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      onSubmit={(id, level) => onSubmit(id, level)}
    />
  );
};

export default AddSkillModal;
