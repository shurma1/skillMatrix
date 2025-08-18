import { Modal, Form, Input } from 'antd';
import type { FC } from 'react';
import type { CreateJobRoleDTO } from '@/types/api/jobrole';

interface CreateJobRoleModalProps {
  open: boolean;
  confirmLoading?: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateJobRoleDTO) => void;
}

const CreateJobRoleModal: FC<CreateJobRoleModalProps> = ({
  open,
  confirmLoading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm<CreateJobRoleDTO>();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch {
      // Form validation failed
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={open}
      title="Создать роль"
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      okText="Создать"
      cancelText="Отмена"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
      >
        <Form.Item
          name="title"
          label="Название роли"
          rules={[{ required: true, message: 'Введите название роли' }]}
        >
          <Input placeholder="Введите название роли" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateJobRoleModal;
