import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Alert, Button, Space, Typography, Checkbox, Card, message, Table } from 'antd';
import { ArrowLeftOutlined, FileOutlined, CheckOutlined } from '@ant-design/icons';
import { 
  useGetSkillQuery, 
  useGetFileInfoQuery, 
  useListUserSkillConfirmationsQuery,
  useConfirmFileAcknowledgmentMutation 
} from '@/store/endpoints';
import DocumentViewer from '../document/DocumentViewer_new';
import { extractErrMessage } from '../../utils/errorHelpers';
import SkillLevelDisplay from '../shared/SkillLevelDisplay';
import { useAppSelector } from '@/hooks/storeHooks';

const { Title, Text } = Typography;

/**
 * Контейнер для отображения документа навыка
 * Отвечает за загрузку данных и логику взаимодействия
 */
const SkillDocumentContainer: React.FC = () => {
  const { skillId = '' } = useParams<{ skillId: string }>();
  const navigate = useNavigate();

  // Получаем текущего пользователя из состояния
  const currentUser = useAppSelector(state => state.auth.user);
  const currentUserId = currentUser?.id?.toString() || '';

  // Local state for acknowledgment
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isSuccessfullyConfirmed, setIsSuccessfullyConfirmed] = useState(false);

  // API запросы
  const { 
    data: skill, 
    isFetching: isSkillLoading,
    error: skillError 
  } = useGetSkillQuery(skillId, { skip: !skillId });

  const { 
    data: fileInfo, 
    isFetching: isFileInfoLoading,
    error: fileError
  } = useGetFileInfoQuery(skill?.fileId as string, { 
    skip: !skill?.fileId 
  });

  // Получаем список подтверждений пользователя по навыку
  const { 
    data: confirmations = [], 
    isFetching: isConfirmationsLoading,
    refetch: refetchConfirmations
  } = useListUserSkillConfirmationsQuery(
    { id: currentUserId, skillId }, 
    { skip: !skillId || !currentUserId }
  );

  // Мутация для подтверждения ознакомления с файлом
  const [confirmFileAcknowledgment, { isLoading: isConfirmingAcknowledgment }] = 
    useConfirmFileAcknowledgmentMutation();

  // Computed values
  const hasError = skillError || fileError;
  const isLoading = isSkillLoading || isFileInfoLoading || isConfirmationsLoading;
  const hasFile = Boolean(skill?.fileId && fileInfo);
  const isDocumentType = skill?.type === 'document';
  
  // Определяем уровень на основе списка подтверждений
  // Получаем последнее подтверждение (последний элемент в отсортированном по дате массиве)
  const lastConfirmation = confirmations.length > 0 
    ? [...confirmations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;
  const currentLevel = lastConfirmation?.level || 0;
  
  // Определяем, нужно ли показывать форму подтверждения или таблицу ознакомления
  const shouldShowAcknowledgmentForm = currentLevel === 0 && !isSuccessfullyConfirmed;
  const isAlreadyAcknowledged = currentLevel > 0 || isSuccessfullyConfirmed;

  // Event handlers
  const handleGoBack = () => {
    navigate(`/skills/${skillId}`);
  };

  const handleAcknowledgmentChange = (checked: boolean) => {
    setIsAcknowledged(checked);
  };

  const handleSubmitAcknowledgment = async () => {
    if (!skill?.fileId) {
      message.error('Файл не найден');
      return;
    }

    try {
      await confirmFileAcknowledgment(skill.fileId).unwrap();
      
      setIsSuccessfullyConfirmed(true);
      setIsAcknowledged(false); // Сбрасываем чекбокс
      
      // Обновляем список подтверждений после успешного подтверждения
      refetchConfirmations();
    } catch (error) {
      const errorMessage = 
        error && 
        typeof error === 'object' && 
        'data' in error &&
        typeof (error as { data?: { message?: string } }).data?.message === 'string'
          ? (error as { data: { message: string } }).data.message
          : 'Ошибка подтверждения ознакомления';
      
      message.error(errorMessage);
    }
  };

  // Компонент таблицы ознакомления
  const AcknowledgmentTable = () => {
    const columns = [
      {
        title: 'Статус',
        key: 'status',
        render: () => (
          <span style={{ color: '#52c41a' }}>
            <CheckOutlined /> Ознакомлен
          </span>
        )
      },
      {
        title: 'Текущий уровень',
        key: 'level',
        render: () => (
          <SkillLevelDisplay level={currentLevel} />
        )
      },
      {
        title: 'Дата последнего подтверждения',
        key: 'date',
        render: () => {
          if (confirmations.length === 0) return '-';
          
          // Получаем последнее подтверждение (сортируем по дате)
          const lastConfirmation = [...confirmations]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          
          if (!lastConfirmation) return '-';
          
          try {
            return new Date(lastConfirmation.date).toLocaleDateString('ru-RU');
          } catch {
            return lastConfirmation.date;
          }
        }
      }
    ];

    return (
      <Table 
        columns={columns}
        dataSource={[{ key: 'user-acknowledgment' }]}
        pagination={false}
        size="small"
      />
    );
  };

  // Render loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Render authentication required state
  if (!currentUser) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Необходима авторизация"
          description="Для просмотра документа и подтверждения ознакомления необходимо войти в систему"
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={() => navigate('/login')}>
              Войти
            </Button>
          }
        />
      </div>
    );
  }

  // Render error state
  if (hasError) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Ошибка загрузки"
          description={extractErrMessage(hasError) || 'Не удалось загрузить информацию о навыке или файле'}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={handleGoBack}>
              Вернуться к навыку
            </Button>
          }
        />
      </div>
    );
  }

  // Render no document state
  if (!isDocumentType || !hasFile) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Документ недоступен"
          description={
            !isDocumentType 
              ? "Этот навык не содержит документа для просмотра"
              : "К навыку не прикреплен файл документа"
          }
          type="info"
          showIcon
          action={
            <Button size="small" onClick={handleGoBack}>
              Вернуться к навыку
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleGoBack}
            style={{ marginBottom: '16px' }}
          >
            Вернуться к навыку
          </Button>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            marginBottom: '8px'
          }}>
            <FileOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
            <Title level={2} style={{ margin: 0 }}>
              {skill.title}
            </Title>
          </div>
          
          <Text type="secondary">
            Документ: {fileInfo?.name || 'Загрузка...'}
          </Text>
        </div>

        {/* Document viewer */}
        <DocumentViewer
          fileId={skill.fileId!}
          fileName={fileInfo!.name}
          fileSize={fileInfo!.size}
          mimeType={fileInfo!.mimeType}
        />

        {/* Document acknowledgment section */}
        <Card 
          title="Подтверждение ознакомления" 
          style={{ marginTop: '24px' }}
          extra={isAlreadyAcknowledged && <CheckOutlined style={{ color: '#52c41a' }} />}
        >
          {shouldShowAcknowledgmentForm ? (
            // Показываем форму для подтверждения ознакомления (если level = 0)
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {isConfirmingAcknowledgment ? (
                // Состояние загрузки
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: '16px', fontSize: '16px' }}>
                    Подтверждение ознакомления...
                  </div>
                </div>
              ) : (
                // Форма подтверждения
                <>
                  <Checkbox
                    checked={isAcknowledged}
                    onChange={(e) => handleAcknowledgmentChange(e.target.checked)}
                    style={{ fontSize: '16px' }}
                  >
                    Я ознакомился с документом
                  </Checkbox>
                  
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleSubmitAcknowledgment}
                      disabled={!isAcknowledged}
                      style={{ minWidth: '200px' }}
                    >
                      Подтвердить ознакомление
                    </Button>
                  </div>
                </>
              )}
            </Space>
          ) : (
            // Показываем таблицу с информацией об ознакомлении (если level > 0 или успешно подтверждено)
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Alert
                message={isSuccessfullyConfirmed ? "Ознакомление с документом успешно подтверждено" : "Вы уже ознакомлены с этим документом"}
                type="success"
                showIcon
              />
              {!isSuccessfullyConfirmed && <AcknowledgmentTable />}
            </Space>
          )}
        </Card>
      </Space>
    </div>
  );
};

export default SkillDocumentContainer;
