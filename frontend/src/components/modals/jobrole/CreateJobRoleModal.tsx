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
      title="Создать должность"
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
          label="Название должности"
          rules={[{ required: true, message: 'Введите название должности' }]}
        >
          <Input placeholder="Введите название должности" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateJobRoleModal;
