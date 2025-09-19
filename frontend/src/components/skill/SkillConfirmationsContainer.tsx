import React, { useState } from 'react';
import { Collapse, message, Button } from 'antd';
import PermissionButton from '@/components/shared/PermissionButton';
import { CheckCircleOutlined } from '@ant-design/icons';
import {
  useListUserSkillConfirmationsQuery,
  useAddUserSkillConfirmationMutation,
  api
} from '@/store/endpoints';
import { useAppDispatch } from '@/hooks/storeHooks';
import type { ConfirmationCreateDTO } from '@/types/api/user';
import SkillConfirmationsList from './SkillConfirmationsList';
import AddConfirmationModal from '@/components/modals/skill/AddConfirmationModal';

interface SkillConfirmationsContainerProps {
  userId: string;
  skillId: string;
  skillTitle: string;
  currentLevel: number;
  jobroleId?: string;
  /** When true, allow adding without requiring EDIT_ALL (e.g., author/verifier context) */
  forceAllowAdd?: boolean;
}

const SkillConfirmationsContainer: React.FC<SkillConfirmationsContainerProps> = ({
  userId,
  skillId,
  skillTitle,
  currentLevel,
  jobroleId: _jobroleId,
  forceAllowAdd = false,
}) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const {
    data: confirmations = [],
    isFetching: isLoadingConfirmations,
  } = useListUserSkillConfirmationsQuery({
    id: userId,
    skillId
  });

  const [addConfirmation, { isLoading: isAddingConfirmation }] = useAddUserSkillConfirmationMutation();

  const handleAddConfirmation = async (confirmationData: ConfirmationCreateDTO) => {
    try {
      await addConfirmation({ id: userId, skillId, body: confirmationData }).unwrap();
      // Точечный апдейт jobrole списка (если в контексте должности)
      if (_jobroleId) {
        try {
          dispatch(
            api.util.updateQueryData(
              'listUserSkillsInJobrole',
              { id: userId, jobroleId: _jobroleId },
              (draft: any[]) => {
                const item = draft?.find(s => s.skillId === skillId);
                if (item) {
                  // Обновляем уровень и цель при необходимости
                  
                  const lvl = confirmationData.level;
                  if (typeof lvl === 'number') {
                    item.level = lvl;
                    if (item.targetLevel < lvl) item.targetLevel = lvl;
                    item.isConfirmed = item.level >= item.targetLevel;
                  }
                }
              }
            )
          );
        } catch { /* silent */ }
      }
      message.success('Подтверждение добавлено');
      setAddModalOpen(false);
      // Без refetch: оптимистическое обновление уже внесено в кэш мутацией
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
        forceAllowAdd ? (
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
        ) : (
          <PermissionButton
            size="small"
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              setAddModalOpen(true);
            }}
          >
            Добавить
          </PermissionButton>
        )
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
