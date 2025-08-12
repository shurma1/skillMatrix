import React, { useState } from 'react';
import { Modal, Form, Select, Upload, Input } from 'antd';
import type { UploadProps } from 'antd';
import { useSearchUsersQuery, useUploadFileMutation, useGetSkillQuery } from '@/store/endpoints';
import type { CreateSkillVersionDTO } from '@/types/api/skill';
import { extractErrMessage } from '../../../utils/errorHelpers';

interface CreateVersionModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateSkillVersionDTO) => Promise<void>;
  loading: boolean;
  skillId: string;
}

interface FormData {
  authorId: string;
  verifierId: string;
}

/**
 * Модал для создания новой версии навыка
 */
const CreateVersionModal: React.FC<CreateVersionModalProps> = ({
  open,
  onCancel,
  onSubmit,
  loading,
  skillId
}) => {
  const [form] = Form.useForm<FormData>();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // API запросы
  const { data: usersSearch } = useSearchUsersQuery({ query: '' });
  const { data: skill } = useGetSkillQuery(skillId, { skip: !skillId });
  const [uploadFile] = useUploadFileMutation();

  // Проверяем, нужен ли файл для данного типа навыка
  const isDocumentType = skill?.type === 'document';

  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const result = await uploadFile({
        name: file.name,
        file
      }).unwrap();
      
      return result.id;
    } catch (error) {
      throw new Error(extractErrMessage(error) || 'Ошибка загрузки файла');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      let fileId: string | undefined = undefined;
      
      // Загружаем файл только если тип документ и файл выбран
      if (isDocumentType && uploadedFile) {
        const uploadedFileId = await handleFileUpload(uploadedFile);
        if (!uploadedFileId) {
          throw new Error('Не удалось загрузить файл');
        }
        fileId = uploadedFileId;
      }

      await onSubmit({
        fileId,
        authorId: values.authorId,
        verifierid: values.verifierId
      });

      handleCancel();
    } catch (error) {
      // Ошибки обрабатываются в родительском компоненте
      throw error;
    }
  };

  const handleCancel = () => {
    form.resetFields();
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

  const users = usersSearch?.rows || [];

  return (
    <Modal
      title="Создать новую версию"
      open={open}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
	  destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="authorId"
          label="Автор"
          rules={[{ required: true, message: 'Выберите автора' }]}
        >
          <Select
            showSearch
            placeholder="Выберите автора"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label as string).toLowerCase().includes(input.toLowerCase())
            }
            options={users.map(user => ({
              value: user.id,
              label: `${user.lastname} ${user.firstname}`.trim()
            }))}
          />
        </Form.Item>

        <Form.Item
          name="verifierId"
          label="Проверяющий"
          rules={[{ required: true, message: 'Выберите проверяющего' }]}
        >
          <Select
            showSearch
            placeholder="Выберите проверяющего"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label as string).toLowerCase().includes(input.toLowerCase())
            }
            options={users.map(user => ({
              value: user.id,
              label: `${user.lastname} ${user.firstname}`.trim()
            }))}
          />
        </Form.Item>

        {isDocumentType && (
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
              <p className="ant-upload-hint">Файл обязателен для документа</p>
            </Upload.Dragger>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default CreateVersionModal;
