import React, { useState } from 'react';
import { Modal, Form, Select, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { useSearchUsersQuery, useUploadFileMutation } from '@/store/endpoints';
import type { CreateSkillVersionDTO } from '@/types/api/skill';
import { extractErrMessage } from '../../utils/errorHelpers';

interface CreateVersionModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateSkillVersionDTO) => Promise<void>;
  loading: boolean;
}

interface FormData {
  authorId: string;
  verifierId: string;
  file: UploadFile[];
}

/**
 * Модал для создания новой версии навыка
 */
const CreateVersionModal: React.FC<CreateVersionModalProps> = ({
  open,
  onCancel,
  onSubmit,
  loading
}) => {
  const [form] = Form.useForm<FormData>();
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);

  // API запросы
  const { data: usersSearch } = useSearchUsersQuery({ query: '' });
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const handleFileUpload = async (file: File) => {
    try {
      const result = await uploadFile({
        name: file.name,
        file
      }).unwrap();
      
      setUploadedFileId(result.id);
      message.success('Файл загружен');
      return false; // Предотвращаем стандартную загрузку
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка загрузки файла');
      return false;
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (!uploadedFileId) {
        message.error('Необходимо загрузить файл');
        return;
      }

      await onSubmit({
        fileId: uploadedFileId,
        authorId: values.authorId,
        verifierid: values.verifierId
      });

      form.resetFields();
      setUploadedFileId(null);
    } catch (error) {
      // Ошибки валидации или отправки обрабатываются в родительском компоненте
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setUploadedFileId(null);
    onCancel();
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
          name="file"
          label="Файл документации"
          rules={[{ required: true, message: 'Необходимо загрузить файл' }]}
        >
          <Upload
            beforeUpload={handleFileUpload}
            maxCount={1}
            showUploadList={{
              showRemoveIcon: true,
              showDownloadIcon: false,
            }}
            onRemove={() => {
              setUploadedFileId(null);
            }}
          >
            <Button
              icon={<UploadOutlined />}
              loading={isUploading}
              disabled={!!uploadedFileId}
            >
              {uploadedFileId ? 'Файл загружен' : 'Выбрать файл'}
            </Button>
          </Upload>
        </Form.Item>

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
              label: `${user.lastname} ${user.firstname} ${user.patronymic}`.trim()
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
              label: `${user.lastname} ${user.firstname} ${user.patronymic}`.trim()
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateVersionModal;
