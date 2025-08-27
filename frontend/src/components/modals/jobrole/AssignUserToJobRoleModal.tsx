import { Modal, Form, Select } from 'antd';
import type { FC } from 'react';
import type { UserDTO } from '@/types/api/auth';

interface AssignUserToJobRoleModalProps {
  open: boolean;
  users: UserDTO[];
  disabledUserIds: string[];
  confirmLoading?: boolean;
  onCancel: () => void;
  onSubmit: (userId: string) => void;
}

interface FormData {
  userId: string;
}

const AssignUserToJobRoleModal: FC<AssignUserToJobRoleModalProps> = ({
  open,
  users,
  disabledUserIds,
  confirmLoading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm<FormData>();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values.userId);
      form.resetFields();
    } catch {
      // Form validation failed
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const userOptions = users
    .filter(user => !disabledUserIds.includes(user.id))
    .map(user => ({
      label: `${user.lastname} ${user.firstname} ${user.patronymic} (${user.login})`,
      value: user.id
    }));

  return (
    <Modal
      open={open}
      title="Назначить пользователя на должность"
  onCancel={handleCancel}
  onOk={handleOk}
  confirmLoading={confirmLoading}
  okText="Назначить"
  cancelText="Отмена"
  destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
      >
        <Form.Item
          name="userId"
          label="Пользователь"
          rules={[{ required: true, message: 'Выберите пользователя' }]}
        >
          <Select
            showSearch
            placeholder="Выберите пользователя"
            optionFilterProp="label"
            options={userOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignUserToJobRoleModal;
