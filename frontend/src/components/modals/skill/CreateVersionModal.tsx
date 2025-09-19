import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Upload, Input } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { Checkbox } from 'antd';
import type { UploadProps } from 'antd';
import { useSearchUsersQuery, useUploadFileMutation, useGetSkillQuery, useGetUserQuery } from '@/store/endpoints';
import { useDebounce } from '@/hooks/useDebounce';
import type { CreateSkillVersionDTO, UpdateSkillVersionDTO } from '@/types/api/skill';
import type { UserDTO } from '@/types/api/auth';
import { extractErrMessage } from '../../../utils/errorHelpers';
import DatePickerWithPaste from '@/components/DatePickerWithPaste.tsx';

interface CreateVersionModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateSkillVersionDTO | UpdateSkillVersionDTO) => Promise<void>;
  onSubmitEx?: (
    data: CreateSkillVersionDTO | UpdateSkillVersionDTO,
    options?: { autoTransferTest?: boolean }
  ) => Promise<void>;
  loading: boolean;
  skillId: string;
  title?: string;
  okText?: string;
  initialAuthorId?: string;
  initialVerifierId?: string;
  initialApprovedDate?: string;
  initialAuditDate?: string; // новая дата ревизии (если редактируем)
  currentFileName?: string;
}

interface FormData {
  authorId: string;
  verifierId: string;
  approvedDate?: Dayjs;
  auditDate?: Dayjs;
  autoTransferTest?: boolean;
}

/**
 * Модал для создания новой версии навыка
 */
const CreateVersionModal: React.FC<CreateVersionModalProps> = ({
  open,
  onCancel,
  onSubmit,
  onSubmitEx,
  loading,
  skillId,
  title,
  okText,
  initialAuthorId,
  initialVerifierId,
  initialApprovedDate,
  initialAuditDate,
  currentFileName,
}) => {
  const [form] = Form.useForm<FormData>();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // Independent search states for each select to avoid leaking search history
  const [authorQuery, setAuthorQuery] = useState('');
  const [verifierQuery, setVerifierQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState<'author' | 'verifier' | null>(null);
  const debouncedAuthorQuery = useDebounce(authorQuery, 400);
  const debouncedVerifierQuery = useDebounce(verifierQuery, 400);

  // API запросы
  const { data: authorUsersSearch, isFetching: isAuthorLoading } = useSearchUsersQuery({ query: debouncedAuthorQuery });
  const { data: verifierUsersSearch, isFetching: isVerifierLoading } = useSearchUsersQuery({ query: debouncedVerifierQuery });
  const { data: skill } = useGetSkillQuery(skillId, { skip: !skillId });
  const [uploadFile] = useUploadFileMutation();

  // Запросы для получения данных предустановленных пользователей
  const { data: initialAuthor } = useGetUserQuery(initialAuthorId as string, { skip: !initialAuthorId });
  const { data: initialVerifier } = useGetUserQuery(initialVerifierId as string, { skip: !initialVerifierId });

  // Проверяем, нужен ли файл для данного типа навыка
  const isDocumentType = skill?.type === 'document';

  // Обновляем форму при изменении пропсов (для режима редактирования)
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        authorId: initialAuthorId,
        verifierId: initialVerifierId,
        approvedDate: initialApprovedDate ? dayjs(initialApprovedDate) : dayjs(),
        auditDate: initialAuditDate ? dayjs(initialAuditDate) : (initialApprovedDate ? dayjs(initialApprovedDate).add(3, 'year') : dayjs().add(3, 'year')),
      });
    }
  }, [open, initialAuthorId, initialVerifierId, initialApprovedDate, initialAuditDate, form]);

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
      const payload: UpdateSkillVersionDTO & { approvedDate?: string; auditDate?: string } = {};
      // Approved date diff
      if (values.approvedDate) {
        const iso = typeof values.approvedDate === 'string'
          ? values.approvedDate
          : values.approvedDate.toDate ? values.approvedDate.toDate().toISOString() : undefined;
        if (iso) {
          // always include for create; for update include when provided
          payload.approvedDate = iso;
        }
      }
      if (values.auditDate) {
        const isoAudit = typeof values.auditDate === 'string'
          ? values.auditDate
          : values.auditDate.toDate ? values.auditDate.toDate().toISOString() : undefined;
        if (isoAudit) {
          payload.auditDate = isoAudit;
        }
      } else if (payload.approvedDate) {
        // fallback генерируем дату ревизии +3 года
        payload.auditDate = dayjs(payload.approvedDate).add(3, 'year').toISOString();
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
        const createPayload: CreateSkillVersionDTO & { approvedDate?: string; auditDate?: string } = {
          fileId,
          authorId: values.authorId,
          verifierid: values.verifierId
        };
        if (payload && payload.approvedDate) {
          createPayload.approvedDate = payload.approvedDate;
        }
        if (payload && payload.auditDate) {
          createPayload.auditDate = payload.auditDate;
        } else if (createPayload.approvedDate) {
          createPayload.auditDate = dayjs(createPayload.approvedDate).add(3, 'year').toISOString();
        }
        if (onSubmitEx) {
          await onSubmitEx(createPayload, { autoTransferTest: values.autoTransferTest });
        } else {
          await onSubmit(createPayload);
        }
      } else {
        if (onSubmitEx) {
          await onSubmitEx(payload);
        } else {
          await onSubmit(payload);
        }
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

  // Функция для формирования опций пользователей
  const createUserOptions = (users: UserDTO[]) => {
    return users.map(user => {
      const nameParts = [user.lastname, user.firstname, user.patronymic].filter(part => part && part.length > 0);
      const fio = nameParts.length > 0 
          ? nameParts.join(' ') 
          : user.login || user.id;
      return { value: user.id, label: fio };
    });
  };

  const authorUsers = authorUsersSearch?.rows || [];
  const verifierUsers = verifierUsersSearch?.rows || [];
  
  // Добавляем предустановленных пользователей к опциям, если они не найдены в поиске
  const authorUsersWithInitial = [...authorUsers];
  if (initialAuthor && !authorUsers.find(u => u.id === initialAuthor.id)) {
    authorUsersWithInitial.unshift(initialAuthor);
  }
  
  const verifierUsersWithInitial = [...verifierUsers];
  if (initialVerifier && !verifierUsers.find(u => u.id === initialVerifier.id)) {
    verifierUsersWithInitial.unshift(initialVerifier);
  }
  
  const authorOptions = createUserOptions(authorUsersWithInitial);
  const verifierOptions = createUserOptions(verifierUsersWithInitial);

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
          auditDate: initialAuditDate ? dayjs(initialAuditDate) : (initialApprovedDate ? dayjs(initialApprovedDate).add(3, 'year') : dayjs().add(3, 'year')),
          autoTransferTest: true,
        }}
        onValuesChange={(changed) => {
          if (changed.approvedDate) {
            const newAudit = dayjs(changed.approvedDate).add(3, 'year');
            form.setFieldsValue({ auditDate: newAudit });
          }
        }}
      >
        <Form.Item name="approvedDate" label="Дата утверждения">
          <DatePickerWithPaste
			  style={{ width: '100%' }}
			  
		  />
        </Form.Item>
        <Form.Item name="auditDate" label="Дата ревизии (аудита)" rules={[{ required: true, message: 'Укажите дату ревизии' }]}>
          <DatePickerWithPaste style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="authorId"
          label="Автор"
          rules={[{ required: false, message: 'Выберите автора' }]}
        >
          <Select
            showSearch
            placeholder="Выберите автора"
            filterOption={false}
            onSearch={(v) => setAuthorQuery(v)}
            onFocus={() => {
              setActiveSearch('author');
              // Если поиск пустой и нет выбранного значения, инициируем поиск
              if (!authorQuery && !form.getFieldValue('authorId')) {
                setAuthorQuery('');
              }
            }}
            onBlur={() => setActiveSearch(prev => prev === 'author' ? null : prev)}
            loading={activeSearch === 'author' && isAuthorLoading}
            notFoundContent={activeSearch === 'author' && isAuthorLoading ? 'Загрузка...' : null}
            options={authorOptions}
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
            filterOption={false}
            onSearch={(v) => setVerifierQuery(v)}
            onFocus={() => {
              setActiveSearch('verifier');
              // Если поиск пустой и нет выбранного значения, инициируем поиск
              if (!verifierQuery && !form.getFieldValue('verifierId')) {
                setVerifierQuery('');
              }
            }}
            onBlur={() => setActiveSearch(prev => prev === 'verifier' ? null : prev)}
            loading={activeSearch === 'verifier' && isVerifierLoading}
            notFoundContent={activeSearch === 'verifier' && isVerifierLoading ? 'Загрузка...' : null}
            options={verifierOptions}
          />
        </Form.Item>
         {(!initialAuthorId && !initialVerifierId) && (
          <Form.Item name="autoTransferTest" valuePropName="checked">
            <Checkbox defaultChecked>
              Автоматически перенести тест
            </Checkbox>
          </Form.Item>
        )}
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
