import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Upload, Input, DatePicker } from 'antd';
import dayjs from 'dayjs';
import type { UploadProps } from 'antd';
import { useSearchUsersQuery, useUploadFileMutation, useGetSkillQuery } from '@/store/endpoints';
import type { CreateSkillVersionDTO, UpdateSkillVersionDTO } from '@/types/api/skill';
import { extractErrMessage } from '../../../utils/errorHelpers';

interface CreateVersionModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateSkillVersionDTO | UpdateSkillVersionDTO) => Promise<void>;
  loading: boolean;
  skillId: string;
  title?: string;
  okText?: string;
  initialAuthorId?: string;
  initialVerifierId?: string;
  initialApprovedDate?: string;
  currentFileName?: string;
}

interface FormData {
  authorId: string;
  verifierId: string;
  approvedDate?: any;
}

/**
 * Модал для создания новой версии навыка
 */
const CreateVersionModal: React.FC<CreateVersionModalProps> = ({
  open,
  onCancel,
  onSubmit,
  loading,
  skillId,
  title,
  okText,
  initialAuthorId,
  initialVerifierId,
  initialApprovedDate,
  currentFileName,
}) => {
  const [form] = Form.useForm<FormData>();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // API запросы
  const { data: usersSearch } = useSearchUsersQuery({ query: '' });
  const { data: skill } = useGetSkillQuery(skillId, { skip: !skillId });
  const [uploadFile] = useUploadFileMutation();

  // Проверяем, нужен ли файл для данного типа навыка
  const isDocumentType = skill?.type === 'document';

  // Обновляем форму при изменении пропсов (для режима редактирования)
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        authorId: initialAuthorId,
        verifierId: initialVerifierId,
        approvedDate: initialApprovedDate ? dayjs(initialApprovedDate) : dayjs(),
      });
    }
  }, [open, initialAuthorId, initialVerifierId, initialApprovedDate, form]);

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
      // Build payload with only changed fields for update
      const payload: UpdateSkillVersionDTO = {};
      // Approved date diff
      if (values.approvedDate) {
        const iso = typeof values.approvedDate === 'string' 
          ? values.approvedDate 
          : values.approvedDate.toDate ? values.approvedDate.toDate().toISOString() : undefined;
        if (iso) {
          // always include for create; for update include when provided
          (payload as any).approvedDate = iso;
        }
      }

      // Author diff
      if (values.authorId && values.authorId !== initialAuthorId) {
        payload.authorId = values.authorId;
      }
      // Verifier diff (note backend expects verifierid)
      if (values.verifierId && values.verifierId !== initialVerifierId) {
        payload.verifierid = values.verifierId;
      }

      let fileId: string | undefined = undefined;

      // Загружаем файл только если тип документ и файл выбран
      if (isDocumentType && uploadedFile) {
        const uploadedFileId = await handleFileUpload(uploadedFile);
        if (!uploadedFileId) {
          throw new Error('Не удалось загрузить файл');
        }
        fileId = uploadedFileId;
        payload.fileId = fileId;
      }

      // For create flow, ensure required fields present
      if (!initialAuthorId && !initialVerifierId) {
        const createPayload: CreateSkillVersionDTO = {
          fileId,
          authorId: values.authorId,
          verifierid: values.verifierId
        };
        if (payload && (payload as any).approvedDate) {
          (createPayload as any).approvedDate = (payload as any).approvedDate;
        }
        await onSubmit(createPayload);
      } else {
        await onSubmit(payload);
      }

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
      title={title || "Создать новую версию"}
      open={open}
      onCancel={handleCancel}
  onOk={handleSubmit}
  okText={okText || 'Создать'}
      confirmLoading={loading}
      width={600}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          authorId: initialAuthorId,
          verifierId: initialVerifierId,
          approvedDate: initialApprovedDate ? dayjs(initialApprovedDate) : dayjs(),
        }}
      >
        <Form.Item name="approvedDate" label="Дата утверждения">
          <DatePicker style={{ width: '100%' }} />
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
            <Form.Item label="Текущий файл">
              <Input
                placeholder="Файл не выбран"
                value={uploadedFile?.name || currentFileName}
                disabled
              />
            </Form.Item>
            <Upload.Dragger {...draggerProps}>
              <p className="ant-upload-drag-icon">📄</p>
              <p className="ant-upload-text">Перетащите новый файл или кликните</p>
              <p className="ant-upload-hint">Если не хотите менять файл, оставьте поле пустым</p>
            </Upload.Dragger>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default CreateVersionModal;
