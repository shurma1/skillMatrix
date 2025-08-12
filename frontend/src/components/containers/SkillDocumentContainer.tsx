import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Alert, Button, Space, Typography, Checkbox, Card, message } from 'antd';
import { ArrowLeftOutlined, FileOutlined, CheckOutlined } from '@ant-design/icons';
import { useGetSkillQuery, useGetFileInfoQuery } from '@/store/endpoints';
import DocumentViewer from '../document/DocumentViewer';
import { extractErrMessage } from '../../utils/errorHelpers';

const { Title, Text } = Typography;

/**
 * Контейнер для отображения документа навыка
 * Отвечает за загрузку данных и логику взаимодействия
 */
const SkillDocumentContainer: React.FC = () => {
  const { skillId = '' } = useParams<{ skillId: string }>();
  const navigate = useNavigate();

  // Local state for acknowledgment
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  // Computed values
  const hasError = skillError || fileError;
  const isLoading = isSkillLoading || isFileInfoLoading;
  const hasFile = Boolean(skill?.fileId && fileInfo);
  const isDocumentType = skill?.type === 'document';

  // Event handlers
  const handleGoBack = () => {
    navigate(`/skills/${skillId}`);
  };

  const handleAcknowledgmentChange = (checked: boolean) => {
    setIsAcknowledged(checked);
  };

  const handleSubmitAcknowledgment = () => {
    // TODO: Implement API call to submit acknowledgment
    console.log('Submitting acknowledgment for skill:', skillId);
    
    setIsSubmitted(true);
    message.success('Ознакомление с документом подтверждено');
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
          extra={isSubmitted && <CheckOutlined style={{ color: '#52c41a' }} />}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Checkbox
              checked={isAcknowledged}
              onChange={(e) => handleAcknowledgmentChange(e.target.checked)}
              disabled={isSubmitted}
              style={{ fontSize: '16px' }}
            >
              Я ознакомился с документом
            </Checkbox>
            
            <div style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                size="large"
                onClick={handleSubmitAcknowledgment}
                disabled={!isAcknowledged || isSubmitted}
                icon={isSubmitted ? <CheckOutlined /> : undefined}
                style={{ minWidth: '200px' }}
              >
                {isSubmitted ? 'Подтверждено' : 'Отправить'}
              </Button>
            </div>

            {isSubmitted && (
              <Alert
                message="Ознакомление подтверждено"
                type="success"
                showIcon
                style={{ marginTop: '16px' }}
              />
            )}
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default SkillDocumentContainer;
