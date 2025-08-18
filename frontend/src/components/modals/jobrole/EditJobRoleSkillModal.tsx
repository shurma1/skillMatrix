import { Modal, Form } from 'antd';
import SkillLevelSelect from '@/components/shared/SkillLevelSelect';
import type { FC } from 'react';

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
