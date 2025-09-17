import { useState } from 'react';
import { Modal, Form, Input, Select, Upload, message, Button } from 'antd';
import type { FC } from 'react';
import type { Dayjs } from 'dayjs';
import type { UploadProps } from 'antd';
import type { UserDTO } from '@/types/api/auth';
import type { CreateSkillDTO } from '@/types/api/skill';
import type { TagDTO, TagCreateDTO, TagUpdateDTO } from '@/types/api/tag';
import {
  useCreateTagMutation,
  useUpdateTagMutation,
  useSearchTagsQuery,
  useSearchUsersQuery
} from '@/store/endpoints';
import { useDebounce } from '@/hooks/useDebounce';
import TagSelectWithActions from '../../shared/TagSelectWithActions';
import CreateTagModal from '../tag/CreateTagModal';
import EditTagModal from '../tag/EditTagModal';
import PermissionButton from '@/components/shared/PermissionButton';
import DatePickerWithPaste from "@/components/DatePickerWithPaste.tsx";

interface CreateSkillModalProps {
  open: boolean;
  confirmLoading: boolean;
  users: UserDTO[];
  tags: TagDTO[];
  onCancel: () => void;
  onSubmit: (values: CreateSkillModalFormData) => void;
}

export interface CreateSkillModalFormData extends Omit<CreateSkillDTO, 'approvedDate' | 'fileId' | 'documentId'> {
  approvedDate: Dayjs;
  selectedTags: string[];
  uploadedFile: File | null;
  documentId?: string;
}

const CreateSkillModal: FC<CreateSkillModalProps> = ({
  open,
  confirmLoading,
  users: _users, // renamed to indicate it's intentionally unused
  tags,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm<CreateSkillModalFormData>();
  const [selectedCreateTags, setSelectedCreateTags] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // Independent search state for author & verifier
  const [authorQuery, setAuthorQuery] = useState('');
  const [verifierQuery, setVerifierQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState<'author' | 'verifier' | null>(null);
  const debouncedAuthorQuery = useDebounce(authorQuery, 400);
  const debouncedVerifierQuery = useDebounce(verifierQuery, 400);
  
  // Tag modals state
  const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);
  const [isEditTagOpen, setIsEditTagOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagDTO | null>(null);
  
  const typeValue = Form.useWatch<'skill' | 'document'>('type', form);

  // Tag mutations
  const [createTag, { isLoading: isCreatingTag }] = useCreateTagMutation();
  const [updateTag, { isLoading: isUpdatingTag }] = useUpdateTagMutation();
  const { refetch: refetchTags } = useSearchTagsQuery({ query: '' });
  const { data: authorUsersSearch, isFetching: isAuthorLoading } = useSearchUsersQuery({ query: debouncedAuthorQuery });
  const { data: verifierUsersSearch, isFetching: isVerifierLoading } = useSearchUsersQuery({ query: debouncedVerifierQuery });

  const handleOk = () => {
    form.submit();
  };

  const handleFinish = (values: CreateSkillModalFormData) => {
    onSubmit({
      ...values,
      selectedTags: selectedCreateTags,
      uploadedFile,
      documentId: values.documentId
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedCreateTags([]);
    setUploadedFile(null);
    onCancel();
  };

  const handleCreateTag = async (values: TagCreateDTO) => {
    try {
      await createTag(values).unwrap();
      message.success('Тег создан');
      setIsCreateTagOpen(false);
      refetchTags();
    } catch {
      message.error('Ошибка создания тега');
    }
  };

  const handleEditTag = async (values: TagUpdateDTO) => {
    if (!editingTag) return;
    
    try {
      await updateTag({ id: editingTag.id, body: values }).unwrap();
      message.success('Тег обновлен');
      setIsEditTagOpen(false);
      setEditingTag(null);
      refetchTags();
    } catch {
      message.error('Ошибка обновления тега');
    }
  };

  const handleEditTagClick = (tag: TagDTO) => {
    setEditingTag(tag);
    setIsEditTagOpen(true);
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
    <>
      <Modal
        open={open}
        title="Добавить навык"
        onCancel={handleCancel}
        destroyOnHidden
        footer={[
          <Button key="cancel" onClick={handleCancel}>Отмена</Button>,
          <PermissionButton key="ok" type="primary" loading={confirmLoading} onClick={handleOk}>Создать</PermissionButton>
        ]}
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
            <DatePickerWithPaste style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="verifierId"
            label="Проверяющий"
            rules={[{ required: true, message: 'Укажите проверяющего' }]}
          >
            <Select
              showSearch
              placeholder="Выберите проверяющего"
              filterOption={false}
              onSearch={(v) => setVerifierQuery(v)}
              onFocus={() => { setActiveSearch('verifier'); setVerifierQuery(''); }}
              onBlur={() => setActiveSearch(prev => prev === 'verifier' ? null : prev)}
              loading={activeSearch === 'verifier' && isVerifierLoading}
              notFoundContent={activeSearch === 'verifier' && isVerifierLoading ? 'Загрузка...' : null}
              options={(verifierUsersSearch?.rows || []).map(user => {
                const fio = [user.firstname, user.lastname, user.patronymic].filter(Boolean).join(' ');
                return { value: user.id, label: fio };
              })}
            />
          </Form.Item>
          
          <Form.Item name="authorId" label="Автор">
            <Select
              allowClear
              showSearch
              placeholder="Выберите автора"
              filterOption={false}
              onSearch={(v) => setAuthorQuery(v)}
              onFocus={() => { setActiveSearch('author'); setAuthorQuery(''); }}
              onBlur={() => setActiveSearch(prev => prev === 'author' ? null : prev)}
              loading={activeSearch === 'author' && isAuthorLoading}
              notFoundContent={activeSearch === 'author' && isAuthorLoading ? 'Загрузка...' : null}
              options={(authorUsersSearch?.rows || []).map(user => {
                const fio = [user.firstname, user.lastname, user.patronymic].filter(Boolean).join(' ');
                return { value: user.id, label: fio };
              })}
            />
          </Form.Item>
          
          {typeValue === 'document' && (
            <Form.Item name="documentId" label="Номер документа">
              <Input placeholder="Введите Номер документа" />
            </Form.Item>
          )}
          
          <Form.Item label="Теги">
            <TagSelectWithActions
              value={selectedCreateTags}
              onChange={setSelectedCreateTags}
              tags={tags}
              onEditTag={handleEditTagClick}
              onCreateTag={() => setIsCreateTagOpen(true)}
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

      <CreateTagModal
        open={isCreateTagOpen}
        confirmLoading={isCreatingTag}
        onCancel={() => setIsCreateTagOpen(false)}
        onSubmit={handleCreateTag}
      />

      <EditTagModal
        open={isEditTagOpen}
        confirmLoading={isUpdatingTag}
        tag={editingTag}
        onCancel={() => {
          setIsEditTagOpen(false);
          setEditingTag(null);
        }}
        onSubmit={handleEditTag}
      />
    </>
  );
};

export default CreateSkillModal;
