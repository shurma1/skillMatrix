import { Modal, Form, Button } from 'antd';
import SkillLevelSelect from '@/components/shared/SkillLevelSelect';
import type { FC } from 'react';
import PermissionButton from '@/components/shared/PermissionButton';

interface EditJobRoleSkillModalProps {
  open: boolean;
  currentTargetLevel: number;
  confirmLoading?: boolean;
  onCancel: () => void;
  onSubmit: (targetLevel: number) => void;
}

interface FormData {
  targetLevel: number;
}

const EditJobRoleSkillModal: FC<EditJobRoleSkillModalProps> = ({
  open,
  currentTargetLevel,
  confirmLoading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm<FormData>();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values.targetLevel);
    } catch {
      // Form validation failed
    }
  };

  return (
    <Modal
      open={open}
      title="Изменить целевой уровень"
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onCancel}>Отмена</Button>,
        <PermissionButton key="ok" type="primary" loading={confirmLoading} onClick={handleOk}>Сохранить</PermissionButton>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={{
          targetLevel: currentTargetLevel
        }}
      >
        <Form.Item
          name="targetLevel"
          label="Целевой уровень"
          rules={[
            { required: true, message: 'Укажите целевой уровень' }
          ]}
        >
          <SkillLevelSelect placeholder="Выберите требуемый уровень" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditJobRoleSkillModal;
