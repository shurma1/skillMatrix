import { Modal, Form, Input } from 'antd';
import type { FC } from 'react';
import type { UserCreateDTO } from '@/types/api/user';

interface CreateUserModalProps {
  open: boolean;
  confirmLoading?: boolean;
  onCancel: () => void;
  onSubmit: (data: UserCreateDTO) => void;
}

const CreateUserModal: FC<CreateUserModalProps> = ({
  open,
  confirmLoading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm<UserCreateDTO>();

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
      title="Добавить пользователя"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      okText="Добавить"
      cancelText="Отмена"
	  destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
      >
        <Form.Item
          name="login"
          label="Логин"
          rules={[{ required: true, message: 'Введите логин' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastname"
          label="Фамилия"
          rules={[{ required: true, message: 'Введите фамилию' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="firstname"
          label="Имя"
          rules={[{ required: true, message: 'Введите имя' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="patronymic"
          label="Отчество"
          rules={[{ required: true, message: 'Введите отчество' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { type: 'email', message: 'Некорректный email' },
            { required: false }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Пароль"
          rules={[
            { required: true, message: 'Введите пароль' },
            { min: 6, message: 'Пароль должен быть не менее 6 символов' }
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
