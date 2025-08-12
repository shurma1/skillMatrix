import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Typography, Button, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useCreateTestMutation } from '@/store/endpoints';
import type { CreateTestDTO } from '@/types/api/test';
import TestForm from './TestForm';

const { Title } = Typography;

const TestCreateContainer: React.FC = () => {
  const { skillId = '' } = useParams<{ skillId: string }>();
  const navigate = useNavigate();
  
  const [createTest, { isLoading }] = useCreateTestMutation();

  const handleSubmit = async (values: CreateTestDTO) => {
    try {
      await createTest({ skillId, ...values }).unwrap();
      message.success('Тест успешно создан');
      navigate(`/skills/${skillId}`);
    } catch (error) {
      console.error('Error creating test:', error);
      message.error('Ошибка при создании теста');
    }
  };

  const handleGoBack = () => {
    navigate(`/skills/${skillId}`);
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
          Создание теста
        </Title>
      </div>

      <TestForm 
        onSubmit={handleSubmit}
        loading={isLoading}
      />
    </Space>
  );
};

export default TestCreateContainer;
