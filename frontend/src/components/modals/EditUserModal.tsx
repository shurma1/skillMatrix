import { Modal, Form, Input } from 'antd';
import type { FC } from 'react';
import type { UserUpdateDTO, UserCreateDTO } from '@/types/api/user';
import type { UserDTO } from '@/types/api/auth';

interface EditUserModalProps {
  open: boolean;
  user: UserDTO | null;
  confirmLoading?: boolean;
  onCancel: () => void;
  onSubmit: (data: UserUpdateDTO) => void;
}

const EditUserModal: FC<EditUserModalProps> = ({
  open,
  user,
  confirmLoading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm<UserUpdateDTO & Pick<UserCreateDTO, 'password'>>();

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
      title="Редактировать пользователя"
      onCancel={onCancel}
      okText="Сохранить"
      cancelText="Отмена"
      confirmLoading={confirmLoading}
      onOk={handleOk}
	  destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          login: user?.login,
          firstname: user?.firstname,
          lastname: user?.lastname,
          patronymic: user?.patronymic,
          email: user?.email,
        }}
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
          rules={[{ min: 6, message: 'Пароль должен быть не менее 6 символов' }]}
        >
          <Input.Password placeholder="Оставьте пустым чтобы не менять" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
