import React, { useState } from 'react';
import { Collapse, Button, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import {
  useListUserSkillConfirmationsQuery,
  useAddUserSkillConfirmationMutation
} from '@/store/endpoints';
import type { ConfirmationCreateDTO } from '@/types/api/user';
import SkillConfirmationsList from './SkillConfirmationsList';
import AddConfirmationModal from '@/components/modals/skill/AddConfirmationModal';

interface SkillConfirmationsContainerProps {
  userId: string;
  skillId: string;
  skillTitle: string;
  currentLevel: number;
}

const SkillConfirmationsContainer: React.FC<SkillConfirmationsContainerProps> = ({
  userId,
  skillId,
  skillTitle,
  currentLevel
}) => {
  const [addModalOpen, setAddModalOpen] = useState(false);

  const {
    data: confirmations = [],
    isFetching: isLoadingConfirmations,
    refetch: refetchConfirmations
  } = useListUserSkillConfirmationsQuery({
    id: userId,
    skillId
  });

  const [addConfirmation, { isLoading: isAddingConfirmation }] = 
    useAddUserSkillConfirmationMutation();

  const handleAddConfirmation = async (
    confirmationData: ConfirmationCreateDTO
  ) => {
    try {
      await addConfirmation({
        id: userId,
        skillId,
        body: confirmationData
      }).unwrap();
      
      message.success('Подтверждение добавлено');
      setAddModalOpen(false);
      refetchConfirmations();
    } catch (error) {
      const errorMessage = 
        error && 
        typeof error === 'object' && 
        'data' in error &&
        typeof (error as { data?: { message?: string } }).data?.message === 'string'
          ? (error as { data: { message: string } }).data.message
          : 'Ошибка добавления подтверждения';
      
      message.error(errorMessage);
    }
  };

  const collapseItems = [
    {
      key: 'confirmations',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircleOutlined />
          Подтверждения навыка ({confirmations.length})
        </span>
      ),
      extra: (
        <Button
          size="small"
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            setAddModalOpen(true);
          }}
        >
          Добавить
        </Button>
      ),
      children: (
        <SkillConfirmationsList
          confirmations={confirmations}
          loading={isLoadingConfirmations}
        />
      )
    }
  ];

  return (
    <>
      <Collapse
        size="small"
        ghost
        items={collapseItems}
        style={{ marginTop: 8 }}
      />
      
      <AddConfirmationModal
        open={addModalOpen}
        skillTitle={skillTitle}
        currentLevel={currentLevel}
        confirmLoading={isAddingConfirmation}
        onCancel={() => setAddModalOpen(false)}
        onSubmit={handleAddConfirmation}
      />
    </>
  );
};

export default SkillConfirmationsContainer;
