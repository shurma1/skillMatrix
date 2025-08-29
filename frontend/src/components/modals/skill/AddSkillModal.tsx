import React, { useMemo, useRef, useState } from 'react';
import { Modal, Form, Select, Spin } from 'antd';
import type { SkillWithCurrentVersionDTO } from '@/types/api/skill';
import SkillLevelSelect from '@/components/shared/SkillLevelSelect';
import { useSearchSkillsQuery } from '@/store/endpoints';

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
  const [search, setSearch] = useState('');
  const debounceRef = useRef<number | null>(null);
  
  const safeOptions = Array.isArray(options) ? options : [];

  // Remote search when user types
  const { data: searchData, isFetching } = useSearchSkillsQuery(
    { query: search, limit: 10, page: 1 },
    { skip: !search }
  );

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

  const listForSelect: SkillWithCurrentVersionDTO[] = useMemo(() => {
    // Use remote results when a search query is present; otherwise fallback to provided options
    return search ? (searchData?.rows ?? []) : safeOptions;
  }, [search, searchData?.rows, safeOptions]);

  const skillOptions = useMemo(() => (
    (listForSelect || [])
      .filter((skill) => !disabledIds.includes(skill.id))
      .map((skill) => ({ label: skill.title, value: skill.id }))
  ), [listForSelect, disabledIds]);

  const handleSearch = (value: string) => {
    // simple debounce to avoid flooding requests
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      setSearch(value.trim());
    }, 250);
  };
  
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
            allowClear
            placeholder="Введите название для поиска"
            filterOption={false}
            onSearch={handleSearch}
            options={skillOptions}
            notFoundContent={isFetching ? <Spin size="small" /> : null}
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
