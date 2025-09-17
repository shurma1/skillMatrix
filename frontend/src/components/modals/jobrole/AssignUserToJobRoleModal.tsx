import { Modal, Form, Select } from 'antd';
import { useState } from 'react';
import { useSearchUsersQuery } from '@/store/endpoints';
import { useDebounce } from '@/hooks/useDebounce';
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
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 400);
  const { data: searched, isFetching } = useSearchUsersQuery({ query: debounced });

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

  const base = debounced ? (searched?.rows || []) : users;
  const filtered = base.filter(u => !disabledUserIds.includes(u.id));
  const userOptions = filtered.map(user => {
    const fio = [user.firstname, user.lastname, (user as any).middlename || user.patronymic].filter(Boolean).join(' ');
    return { label: `${fio} (${user.login})`, value: user.id };
  });

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
            filterOption={false}
            onSearch={(v) => setQuery(v)}
            loading={isFetching}
            notFoundContent={isFetching ? 'Загрузка...' : undefined}
            options={userOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignUserToJobRoleModal;
