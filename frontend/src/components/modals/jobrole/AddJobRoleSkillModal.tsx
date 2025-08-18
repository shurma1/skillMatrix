import { Modal, Form, Select } from 'antd';
import type { FC } from 'react';
import { useState, useMemo } from 'react';
import { useSearchSkillsQuery } from '@/store/endpoints';
import { useDebounce } from '@/hooks/useDebounce';
import SkillLevelSelect from '@/components/shared/SkillLevelSelect';

interface AddJobRoleSkillModalProps {
  open: boolean;
  disabledSkillIds: string[];
  confirmLoading?: boolean;
  onCancel: () => void;
  onSubmit: (skillId: string, targetLevel: number) => void;
}

interface FormData {
  skillId: string;
  targetLevel: number;
}

const AddJobRoleSkillModal: FC<AddJobRoleSkillModalProps> = ({
  open,
  disabledSkillIds,
  confirmLoading,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm<FormData>();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  // API запрос для поиска навыков
  const { data: skillsData, isFetching: isLoadingSkills } = useSearchSkillsQuery(
    { 
      query: debouncedQuery || ' ', // Пробел чтобы получить все навыки при пустом запросе
      limit: 50,
      page: 1
    },
    { 
      skip: !open // Не выполняем запрос если модал закрыт
    }
  );

  const skillOptions = useMemo(() => {
    if (!skillsData?.rows) return [];
    
    return skillsData.rows
      .filter(skill => !disabledSkillIds.includes(skill.id))
      .map(skill => ({
        label: skill.title,
        value: skill.id
      }));
  }, [skillsData?.rows, disabledSkillIds]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values.skillId, values.targetLevel);
      form.resetFields();
    } catch {
      // Form validation failed
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSearchQuery(''); // Сбрасываем поиск при закрытии
    onCancel();
  };

  return (
    <Modal
      open={open}
      title="Добавить навык к роли"
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
            placeholder="Введите название навыка для поиска"
            optionFilterProp="children"
            onSearch={setSearchQuery}
            loading={isLoadingSkills}
            options={skillOptions}
            filterOption={false} // Отключаем локальную фильтрацию, используем серверную
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

export default AddJobRoleSkillModal;
