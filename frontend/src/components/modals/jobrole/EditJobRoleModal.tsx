import { Modal, Form, Input } from 'antd';
import type { FC } from 'react';
import type { JobRoleDTO, UpdateJobRoleDTO } from '@/types/api/jobrole';

interface EditJobRoleModalProps {
  open: boolean;
  jobRole: JobRoleDTO | null;
  confirmLoading?: boolean;
  onCancel: () => void;
  onSubmit: (data: UpdateJobRoleDTO) => void;
}

const EditJobRoleModal: FC<EditJobRoleModalProps> = ({
  open,
  jobRole,
  confirmLoading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm<UpdateJobRoleDTO>();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch {
      // Form validation failed
    }
  };

  return (
    <Modal
      open={open}
      title="Редактировать должность"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      okText="Сохранить"
      cancelText="Отмена"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={{
          title: jobRole?.title
        }}
      >
        <Form.Item
          name="title"
          label="Название должности"
          rules={[{ required: true, message: 'Введите название должности' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditJobRoleModal;
