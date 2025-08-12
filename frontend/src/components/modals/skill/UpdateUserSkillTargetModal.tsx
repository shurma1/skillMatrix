import React from 'react';
import SelectEntityModal from '../shared/SelectEntityModal';

interface UpdateUserSkillTargetModalProps {
  open: boolean;
  currentTarget: number;
  onCancel: () => void;
  onSubmit: (targetLevel: number) => void;
  confirmLoading?: boolean;
}

const UpdateUserSkillTargetModal: React.FC<UpdateUserSkillTargetModalProps> = ({
  open,
  currentTarget,
  onCancel,
  onSubmit,
  confirmLoading
}) => (
  <SelectEntityModal
    open={open}
    title="Изменить целевой уровень"
    okText="Сохранить"
    fieldLabel="Целевой уровень"
    mode="withNumber"
    numberFieldLabel="Целевой уровень"
    numberInitial={currentTarget}
    numberMin={1}
    numberMax={5}
    options={[{ value: 'dummy', label: 'dummy' }]} // Не используется в данном режиме
    onCancel={onCancel}
    confirmLoading={confirmLoading}
    onSubmit={(_, level) => onSubmit(level)}
  />
);

export default UpdateUserSkillTargetModal;
