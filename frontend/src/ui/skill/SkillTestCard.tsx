import React, { useState } from 'react';
import { Card, Skeleton, Button, Form, InputNumber, Input, Space } from 'antd';
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

  const handleSubmit = (values: CreateTestDTO) => { onCreateTest(values); };

  return (
    <Card
      title="Тест"
      extra={<Space>{test && <Button onClick={onOpenTest}>Открыть</Button>}<Button onClick={onRefresh}>Обновить</Button>{!test && <Button type="primary" onClick={() => setShowCreate(s => !s)}>{showCreate ? 'Отмена' : 'Создать'}</Button>}</Space>}
    >
      {test ? (
        <div>
          <p><b>Название:</b> {test.title}</p>
          <p><b>Вопросов:</b> {test.questionsCount}</p>
          <p><b>Порог:</b> {test.needScore}</p>
          <p><b>Лимит времени:</b> {test.timeLimit} сек.</p>
        </div>
      ) : showCreate ? (
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ needScore: 1, timeLimit: 60, title: '', questions: [] }}>
          <Form.Item name="title" label="Название" rules={[{ required: true, message: 'Введите название' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="needScore" label="Необходимый балл" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item name="timeLimit" label="Лимит времени (сек)" rules={[{ required: true }]}>
            <InputNumber min={10} />
          </Form.Item>
          <Form.Item shouldUpdate>
            {() => <Button type="primary" htmlType="submit" loading={creating}>Создать</Button>}
          </Form.Item>
        </Form>
      ) : <Skeleton active paragraph={{ rows: 3 }} />}
    </Card>
  );
};

export default SkillTestCard;
