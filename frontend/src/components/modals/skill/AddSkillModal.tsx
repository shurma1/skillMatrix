import React from 'react';
import { Modal, Form, Select } from 'antd';
import type { SkillWithCurrentVersionDTO } from '@/types/api/skill';
import SkillLevelSelect from '@/components/shared/SkillLevelSelect';

interface AddSkillModalProps {
  open: boolean;
  options: SkillWithCurrentVersionDTO[];
  disabledIds: string[];
  confirmLoading?: boolean;
  onCancel: () => void;
  onSubmit: (skillId: string, targetLevel: number) => void;
}

interface FormData {
  skillId: string;
  targetLevel: number;
}

const AddSkillModal: React.FC<AddSkillModalProps> = ({
  open,
  options,
  disabledIds,
  confirmLoading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm<FormData>();
  
  const safeOptions = Array.isArray(options) ? options : [];

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values.skillId, values.targetLevel);
    } catch {
      // Form validation failed
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const skillOptions = safeOptions
    .filter(skill => !disabledIds.includes(skill.id))
    .map(skill => ({
      label: skill.title,
      value: skill.id
    }));
  
  return (
    <Modal
      open={open}
      title="Добавить навык"
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      okText="Добавить"
      cancelText="Отмена"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={{
          targetLevel: 1
        }}
      >
        <Form.Item
          name="skillId"
          label="Навык"
          rules={[{ required: true, message: 'Выберите навык' }]}
        >
          <Select
            showSearch
            placeholder="Выберите навык"
            optionFilterProp="label"
            options={skillOptions}
          />
        </Form.Item>
        
        <Form.Item
          name="targetLevel"
          label="Целевой уровень"
          rules={[
            { required: true, message: 'Укажите целевой уровень' }
          ]}
        >
          <SkillLevelSelect placeholder="Выберите целевой уровень" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSkillModal;
