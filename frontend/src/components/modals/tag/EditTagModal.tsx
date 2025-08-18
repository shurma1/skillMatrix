import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import type { TagDTO, TagUpdateDTO } from '@/types/api/tag';

interface EditTagModalProps {
  open: boolean;
  confirmLoading: boolean;
  tag: TagDTO | null;
  onCancel: () => void;
  onSubmit: (values: TagUpdateDTO) => void;
}

const EditTagModal: React.FC<EditTagModalProps> = ({
  open,
  confirmLoading,
  tag,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm<TagUpdateDTO>();

  useEffect(() => {
    if (open && tag) {
      form.setFieldsValue({
        name: tag.name
      });
    }
  }, [open, tag, form]);

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values: TagUpdateDTO) => {
    onSubmit(values);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      open={open}
      title="Редактировать тег"
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

export default EditTagModal;
