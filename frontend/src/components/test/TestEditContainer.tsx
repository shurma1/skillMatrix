import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Typography, Button, Space, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGetTestQuery, useGetTestFullQuery } from '@/store/endpoints';
import type { CreateTestDTO } from '@/types/api/test';
import { useUpdateTestMutation } from '@/store/endpoints';
import TestForm from './TestForm';

const { Title } = Typography;

const TestEditContainer: React.FC = () => {
  const { skillId = '', testId = '' } = useParams<{ 
    skillId: string; 
    testId: string; 
  }>();
  const navigate = useNavigate();
  
  const { data: preview, isLoading: isPreviewLoading } = useGetTestQuery(testId, { skip: !testId });
  const { data: full, isLoading: isFullLoading, error: fullError } = useGetTestFullQuery(testId, { skip: !testId });

  const [updateTest, { isLoading: isUpdating }] = useUpdateTestMutation();

  const handleSubmit = async (values: CreateTestDTO) => {
    try {
      await updateTest({ testId, body: values }).unwrap();
      message.success('Тест обновлён');
      navigate(`/skills/${skillId}`);
    } catch (error) {
      console.error('Error updating test:', error);
      message.error('Ошибка при обновлении теста');
    }
  };

  const handleGoBack = () => {
    navigate(`/skills/${skillId}`);
  };

  if (isPreviewLoading || isFullLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (fullError || !full) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '48px' 
      }}>
        <Title level={3}>Тест не найден</Title>
        <Button 
          type="primary" 
          onClick={handleGoBack}
        >
          Вернуться к навыку
        </Button>
      </div>
    );
  }

  // Преобразование данных теста для формы
  const initialValues: Partial<CreateTestDTO> = {
    title: preview?.title || '',
    needScore: full.needScore,
    // Backend returns seconds; UI expects minutes
    timeLimit: Math.max(1, Math.round((full.timeLimit || 60) / 60)),
    // Include questions from full test response
    questions: full.questions || [],
  };

  return (
    <Space 
      direction="vertical" 
      size={24} 
      style={{ width: '100%', padding: '24px' }}
    >
      <div>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleGoBack}
          style={{ marginBottom: '16px' }}
        >
          Вернуться к навыку
        </Button>
        <Title level={2} style={{ margin: 0 }}>
          Редактирование теста
        </Title>
      </div>

      <TestForm 
        onSubmit={handleSubmit}
  initialValues={initialValues}
  loading={isUpdating}
      />
    </Space>
  );
};

export default TestEditContainer;
