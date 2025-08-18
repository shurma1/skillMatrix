import React from 'react';
import { Modal, Form, Input } from 'antd';
import type { TagCreateDTO } from '@/types/api/tag';

interface CreateTagModalProps {
  open: boolean;
  confirmLoading: boolean;
  onCancel: () => void;
  onSubmit: (values: TagCreateDTO) => void;
}

const CreateTagModal: React.FC<CreateTagModalProps> = ({
  open,
  confirmLoading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm<TagCreateDTO>();

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values: TagCreateDTO) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={open}
      title="Создать тег"
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          name="name"
          label="Название тега"
          rules={[
            { required: true, whitespace: true, message: 'Введите название тега' },
            { max: 50, message: 'Название не должно превышать 50 символов' }
          ]}
        >
          <Input placeholder="Название" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTagModal;
