import { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, message, Button } from 'antd';
import type { FC } from 'react';
import type { SkillWithCurrentVersionDTO, UpdateSkillDTO } from '@/types/api/skill';
import type { TagDTO, TagCreateDTO, TagUpdateDTO } from '@/types/api/tag';
import {
  useCreateTagMutation,
  useUpdateTagMutation,
  useSearchTagsQuery
} from '@/store/endpoints';
import TagSelectWithActions from '@/components/shared/TagSelectWithActions';
import CreateTagModal from '../tag/CreateTagModal';
import EditTagModal from '../tag/EditTagModal';
import PermissionButton from '@/components/shared/PermissionButton';

interface EditSkillModalProps {
  open: boolean;
  confirmLoading: boolean;
  skill?: SkillWithCurrentVersionDTO;
  tags: TagDTO[];
  onCancel: () => void;
  onSubmit: (values: UpdateSkillDTO) => void;
}

const EditSkillModal: FC<EditSkillModalProps> = ({ open, confirmLoading, skill, tags, onCancel, onSubmit }) => {
  const [form] = Form.useForm<UpdateSkillDTO & { selectedTags: string[]; documentId?: string }>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Tag modals state
  const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);
  const [isEditTagOpen, setIsEditTagOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagDTO | null>(null);

  // Tag mutations
  const [createTag, { isLoading: isCreatingTag }] = useCreateTagMutation();
  const [updateTag, { isLoading: isUpdatingTag }] = useUpdateTagMutation();
  const { refetch: refetchTags } = useSearchTagsQuery({ query: '' });

  useEffect(() => {
    if (!open) return;
    if (!skill) {
      return;
    }
    
    const formValues = {
      title: skill.title,
      isActive: skill.isActive,
      documentId: skill.documentId || '',
    };
    
    // initialize form values from skill when modal opens
    form.setFieldsValue(formValues);
    
    setSelectedTags((skill.tags || []).map(t => t.id));
  }, [skill, form, open]);

  const handleOk = () => form.submit();

  const handleFinish = (values: UpdateSkillDTO & { selectedTags?: string[]; documentId?: string }) => {
    const payload: UpdateSkillDTO = {};
    if (skill) {
      if (values.title !== undefined && values.title !== skill.title) {
        payload.title = values.title;
      }
      if (typeof values.isActive === 'boolean' && values.isActive !== skill.isActive) {
        payload.isActive = values.isActive;
      }
      if (values.documentId !== undefined && values.documentId !== skill.documentId) {
        payload.documentId = values.documentId;
      }
      const originalTagIds = (skill.tags || []).map(t => t.id).sort();
      const newTagIds = (selectedTags || []).slice().sort();
      const tagsChanged = originalTagIds.length !== newTagIds.length || originalTagIds.some((id, i) => id !== newTagIds[i]);
      if (tagsChanged) {
        payload.tags = selectedTags;
      }
    } else {
      // Fallback if no skill provided
      payload.title = values.title;
      payload.isActive = values.isActive;
      payload.documentId = values.documentId;
      payload.tags = selectedTags;
    }
    
    // Call onSubmit and reset form on success
    onSubmit(payload);
    form.resetFields();
    setSelectedTags([]);
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedTags([]);
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

  return (
    <>
      <Modal
        open={open}
        title="Изменить навык"
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>Отмена</Button>,
          <PermissionButton key="ok" type="primary" loading={confirmLoading} onClick={handleOk}>Сохранить</PermissionButton>
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="title"
            label="Название"
            rules={[{ required: true, whitespace: true, message: 'Введите название' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Статус" name="isActive" valuePropName="checked">
            <Switch checkedChildren="Активен" unCheckedChildren="Неактивен" />
          </Form.Item>

          {skill?.type === 'document' && (
            <Form.Item name="documentId" label="Номер документа">
              <Input placeholder="Введите Номер документа" />
            </Form.Item>
          )}

          <Form.Item label="Теги">
            <TagSelectWithActions
              value={selectedTags}
              onChange={setSelectedTags}
              tags={tags}
              onEditTag={handleEditTagClick}
              onCreateTag={() => setIsCreateTagOpen(true)}
            />
          </Form.Item>
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
        onCancel={() => { setIsEditTagOpen(false); setEditingTag(null); }}
        onSubmit={handleEditTag}
      />
    </>
  );
};

export default EditSkillModal;
