import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Typography, Button, Space, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useGetTestQuery } from '@/store/endpoints';
import type { CreateTestDTO } from '@/types/api/test';
import TestForm from './TestForm';

const { Title } = Typography;

const TestEditContainer: React.FC = () => {
  const { skillId = '', testId = '' } = useParams<{ 
    skillId: string; 
    testId: string; 
  }>();
  const navigate = useNavigate();
  
  const { 
    data: test, 
    isLoading: isTestLoading,
    error: testError 
  } = useGetTestQuery(testId, { skip: !testId });

  const handleSubmit = async (values: CreateTestDTO) => {
    try {
      // TODO: Добавить API endpoint для обновления теста
      message.info('API для редактирования теста пока не реализован');
      console.log('Update test values:', values);
    } catch (error) {
      console.error('Error updating test:', error);
      message.error('Ошибка при обновлении теста');
    }
  };

  const handleGoBack = () => {
    navigate(`/skills/${skillId}`);
  };

  if (isTestLoading) {
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

  if (testError || !test) {
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
    title: test.title || '',
    needScore: test.needScore,
    timeLimit: test.timeLimit,
    // PreviewTestDto doesn't include questions; keep empty to edit via UI
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
      />
    </Space>
  );
};

export default TestEditContainer;
