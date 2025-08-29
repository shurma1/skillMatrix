import React, { useState } from 'react';
import { Card, Skeleton, Button, Form, InputNumber, Input, Space } from 'antd';
import PermissionButton from '@/components/shared/PermissionButton';
import type { PreviewTestDto, CreateTestDTO } from '@/types/api/test';

interface SkillTestCardProps {
  test?: PreviewTestDto;
  creating: boolean;
  onCreateTest: (data: CreateTestDTO) => void;
  onOpenTest: () => void;
  onRefresh: () => void;
}

const SkillTestCard: React.FC<SkillTestCardProps> = ({ test, creating, onCreateTest, onOpenTest, onRefresh }) => {
  const [form] = Form.useForm<CreateTestDTO>();
  const [showCreate, setShowCreate] = useState(false);

  const handleSubmit = (values: CreateTestDTO) => {
    const minutes = Number(values.timeLimit) || 1;
    const payload: CreateTestDTO = { ...values, timeLimit: Math.round(minutes * 60) };
    onCreateTest(payload);
  };

  return (
    <Card
      title="Тест"
  extra={<Space>{test && <Button onClick={onOpenTest}>Открыть</Button>}<Button onClick={onRefresh}>Обновить</Button>{!test && <PermissionButton type="primary" onClick={() => setShowCreate(s => !s)}>{showCreate ? 'Отмена' : 'Создать'}</PermissionButton>}</Space>}
    >
      {test ? (
        <div>
          <p><b>Название:</b> {test.title}</p>
          <p><b>Вопросов:</b> {test.questionsCount}</p>
          <p><b>Порог:</b> {test.needScore}</p>
          <p><b>Лимит времени:</b> {Math.max(1, Math.round((test.timeLimit || 60) / 60))} мин.</p>
        </div>
      ) : showCreate ? (
  <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ needScore: 1, timeLimit: 1, title: '', questions: [] }}>
          <Form.Item name="title" label="Название" rules={[{ required: true, message: 'Введите название' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="needScore" label="Необходимый балл" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="timeLimit" label="Лимит времени (мин)" rules={[{ required: true }]}>
            <InputNumber min={1} placeholder="Лимит времени в минутах" />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => <PermissionButton type="primary" htmlType="submit" loading={creating}>Создать</PermissionButton>}
          </Form.Item>
        </Form>
      ) : <Skeleton active paragraph={{ rows: 3 }} />}
    </Card>
  );
};

export default SkillTestCard;
