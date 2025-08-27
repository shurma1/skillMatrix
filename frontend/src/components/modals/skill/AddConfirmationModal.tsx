import React from 'react';
import { Modal, Form, DatePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import type { ConfirmationCreateDTO } from '@/types/api/user';
import SkillLevelSelect from '@/components/shared/SkillLevelSelect';

const { Title, Text } = Typography;

interface AddConfirmationModalProps {
  open: boolean;
  skillTitle: string;
  currentLevel: number;
  confirmLoading: boolean;
  onCancel: () => void;
  onSubmit: (data: ConfirmationCreateDTO) => void;
}

interface FormData {
  level: number;
  date: dayjs.Dayjs;
}

const AddConfirmationModal: React.FC<AddConfirmationModalProps> = ({
  open,
  skillTitle,
  currentLevel,
  confirmLoading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm<FormData>();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const confirmationData: ConfirmationCreateDTO = {
        level: values.level,
        date: values.date.toISOString()
      };
      
      onSubmit(confirmationData);
    } catch (error) {
      // Validation failed
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Добавить подтверждение навыка"
      open={open}
  onOk={handleSubmit}
  onCancel={handleCancel}
  confirmLoading={confirmLoading}
  okText="Добавить"
  cancelText="Отмена"
    >
      <div style={{ marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>
          Навык: {skillTitle}
        </Title>
        <Text type="secondary">
          Текущий уровень: {currentLevel}
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          level: 1, // Default to начальный уровень
          date: dayjs()
        }}
      >
        <Form.Item
          name="level"
          label="Уровень навыка"
          rules={[
            { required: true, message: 'Укажите уровень' }
          ]}
        >
          <SkillLevelSelect placeholder="Выберите уровень навыка" isFull />
        </Form.Item>

        <Form.Item
          name="date"
          label="Дата подтверждения"
          rules={[{ required: true, message: 'Выберите дату' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder="Выберите дату"
            format="DD.MM.YYYY"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddConfirmationModal;
