import { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload } from 'antd';
import type { FC } from 'react';
import type { Dayjs } from 'dayjs';
import type { UploadProps } from 'antd';
import type { UserDTO } from '@/types/api/auth';
import type { CreateSkillDTO } from '@/types/api/skill';

interface Tag {
  id: string;
  name: string;
}

interface CreateSkillModalProps {
  open: boolean;
  confirmLoading: boolean;
  users: UserDTO[];
  tags: Tag[];
  onCancel: () => void;
  onSubmit: (values: CreateSkillModalFormData) => void;
}

export interface CreateSkillModalFormData extends Omit<CreateSkillDTO, 'approvedDate' | 'fileId'> {
  approvedDate: Dayjs;
  selectedTags: string[];
  uploadedFile: File | null;
}

const CreateSkillModal: FC<CreateSkillModalProps> = ({
  open,
  confirmLoading,
  users,
  tags,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm<CreateSkillModalFormData>();
  const [selectedCreateTags, setSelectedCreateTags] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const typeValue = Form.useWatch<'skill' | 'document'>('type', form);

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values: CreateSkillModalFormData) => {
    onSubmit({
      ...values,
      selectedTags: selectedCreateTags,
      uploadedFile
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedCreateTags([]);
    setUploadedFile(null);
    onCancel();
  };

  const draggerProps: UploadProps = {
    beforeUpload: (file) => {
      setUploadedFile(file);
      return false;
    },
    multiple: false,
    maxCount: 1,
    fileList: uploadedFile
      ? [{ uid: '-1', name: uploadedFile.name, status: 'done' as const }]
      : [],
    onRemove: () => {
      setUploadedFile(null);
    },
  };

  return (
    <Modal
      open={open}
      title="Добавить навык"
      onCancel={handleCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
	  destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ type: 'skill' }}
        onFinish={handleFinish}
      >
        <Form.Item
          name="title"
          label="Название"
          rules={[
            { required: true, whitespace: true, message: 'Введите название' }
          ]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          name="type"
          label="Тип"
          rules={[{ required: true, message: 'Выберите тип' }]}
        >
          <Select
            options={[
              { value: 'skill', label: 'Навык' },
              { value: 'document', label: 'Документ' }
            ]}
          />
        </Form.Item>
        
        <Form.Item
          name="approvedDate"
          label="Дата утверждения"
          rules={[{ required: true, message: 'Укажите дату утверждения' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item
          name="verifierId"
          label="Проверяющий"
          rules={[{ required: true, message: 'Укажите проверяющего' }]}
        >
          <Select
            showSearch
            options={users.map(user => ({
              value: user.id,
              label: `${user.lastname} ${user.firstname}`.trim()
            }))}
          />
        </Form.Item>
        
        <Form.Item name="authorId" label="Автор">
          <Select
            allowClear
            showSearch
            options={users.map(user => ({
              value: user.id,
              label: `${user.lastname} ${user.firstname}`.trim()
            }))}
          />
        </Form.Item>
        
        <Form.Item label="Теги">
          <Select
            mode="multiple"
            value={selectedCreateTags}
            onChange={setSelectedCreateTags}
            options={tags.map(tag => ({
              value: tag.id,
              label: tag.name
            }))}
          />
        </Form.Item>
        
        {typeValue === 'document' && (
          <>
            <Form.Item label="Имя файла">
              <Input
                placeholder="Название документа"
                value={uploadedFile?.name}
                disabled
              />
            </Form.Item>
            <Upload.Dragger {...draggerProps}>
              <p className="ant-upload-drag-icon">📄</p>
              <p className="ant-upload-text">Перетащите файл или кликните</p>
              <p className="ant-upload-hint">Файл обязателен</p>
            </Upload.Dragger>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default CreateSkillModal;
