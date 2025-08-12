import React from 'react';
import { Card, Button, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { PreviewTestDto, CreateTestDTO } from '@/types/api/test';

interface SkillTestCardProps {
  test?: PreviewTestDto;
  hasTest: boolean;
  loading: boolean;
  creating: boolean;
  deleting: boolean;
  onCreateTest: (data: CreateTestDTO) => void;
  onDeleteTest: () => void;
  onOpenTest: () => void;
  onEditTest: () => void;
  onTakeTest: () => void;
  onGoToCreateTest: () => void;
  onRefresh: () => void;
}

const SkillTestCard: React.FC<SkillTestCardProps> = ({ 
  test, 
  hasTest,
  loading,
  onOpenTest,
  onEditTest,
  onTakeTest,
  onGoToCreateTest,
  onRefresh 
}) => {
  const renderTestActions = () => {
    if (!hasTest) {
      return (
        <Button 
          type="primary" 
          onClick={onGoToCreateTest}
        >
          Создать тест
        </Button>
      );
    }

    return (
      <Space>
        <Button type="primary" onClick={onTakeTest}>
          Пройти тест
        </Button>
        <Button onClick={onOpenTest}>
          Просмотр
        </Button>
        <Button 
          icon={<EditOutlined />}
          onClick={onEditTest}
        >
          Редактировать
        </Button>
        <Button onClick={onRefresh}>
          Обновить
        </Button>
      </Space>
    );
  };

  const renderTestContent = () => {
    if (loading) {
      return <div>Загрузка...</div>;
    }

    if (!hasTest) {
      return <div>Тест не создан</div>;
    }

    if (test) {
      return (
        <div>
          <p><strong>Название:</strong> {test.title}</p>
          <p><strong>Вопросов:</strong> {test.questionsCount}</p>
          <p><strong>Порог:</strong> {test.needScore}</p>
          <p><strong>Лимит времени:</strong> {test.timeLimit} сек.</p>
        </div>
      );
    }

    return <div>Информация о тесте недоступна</div>;
  };

  return (
    <Card
      title="Тест"
      extra={renderTestActions()}
    >
      {renderTestContent()}
    </Card>
  );
};

export default SkillTestCard;
