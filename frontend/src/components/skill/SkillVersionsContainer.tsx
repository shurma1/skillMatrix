import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Space, Typography, Button, Spin, Alert, Empty } from 'antd';
import PermissionButton from '@/components/shared/PermissionButton';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { 
  useGetSkillQuery,
  useListSkillVersionsQuery,
  useDeleteSkillVersionMutation,
  useCreateSkillVersionMutation,
  useUpdateSkillVersionMutation
} from '@/store/endpoints';
import { api } from '@/store/endpoints';
import { useAppDispatch } from '@/hooks/storeHooks';
import type { SkillVersionDTO, CreateSkillVersionDTO, UpdateSkillVersionDTO } from '@/types/api/skill';
import SkillVersionCard from './SkillVersionCard';
import CreateVersionModal from '../modals/skill/CreateVersionModal';
import { extractErrMessage } from '../../utils/errorHelpers';

const { Title, Text } = Typography;

/**
 * Контейнер для управления версиями навыка
 * Отвечает за логику работы со списком версий
 */
const SkillVersionsContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { skillId = '' } = useParams<{ skillId: string }>();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingVersion, setEditingVersion] = React.useState<SkillVersionDTO | null>(null);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // API запросы
  const { 
    data: skill, 
    isFetching: isSkillLoading,
    error: skillError 
  } = useGetSkillQuery(skillId, { skip: !skillId });

  const { 
    data: versions = [], 
    isFetching: isVersionsLoading,
    error: versionsError
  } = useListSkillVersionsQuery(skillId, { skip: !skillId });

  // API мутации
  const [deleteVersion] = useDeleteSkillVersionMutation();
  const [createVersion, { isLoading: isCreatingVersion }] = useCreateSkillVersionMutation();
  const [updateVersion, { isLoading: isUpdatingVersion }] = useUpdateSkillVersionMutation();

  // Для скачивания файлов создаем отдельную функцию
  const downloadFileById = async (fileId: string): Promise<Blob | null> => {
    try {
      const response = await fetch(`/api/file/${fileId}`);
      if (response.ok) {
        return await response.blob();
      }
      return null;
    } catch {
      return null;
    }
  };

  // Computed values
  const hasError = skillError || versionsError;
  const isLoading = isSkillLoading || isVersionsLoading;
  const latestVersion = versions.length > 0 ? Math.max(...versions.map(v => v.version)) : 0;
  const sortedVersions = [...versions].sort((a, b) => b.version - a.version);

  // Event handlers
  const handleGoBack = () => {
    navigate(`/skills/${skillId}`);
  };

  const handleCreateVersion = () => {
    setIsCreateModalOpen(true);
  };
  const handleEditVersion = (version: SkillVersionDTO) => {
    setEditingVersion(version);
    setIsEditModalOpen(true);
  };

  const handleCreateVersionSubmit = async (data: CreateSkillVersionDTO | UpdateSkillVersionDTO) => {
    try {
      const created = await createVersion({
        id: skillId,
        body: data as CreateSkillVersionDTO
      }).unwrap();
      // Insert new version into cache at top and update latest marker logic
      dispatch(
        api.util.updateQueryData('listSkillVersions', skillId, (draft: SkillVersionDTO[] | undefined) => {
          if (!draft) return;
          draft.unshift(created);
        })
      );
      message.success('Версия создана');
      setIsCreateModalOpen(false);
      // no refetch to avoid flicker
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка создания версии');
    }
  };

  const handleDownloadVersion = async (versionId: string, fileId: string) => {
    try {
      const blob = await downloadFileById(fileId);
      
      if (blob) {
        const version = versions.find(v => v.id === versionId);
        const file = version?.files.find(f => f.id === fileId);
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file?.filename || file?.name || 'download';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        message.success('Файл загружен');
      } else {
        message.error('Не удалось загрузить файл');
      }
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка загрузки файла');
    }
  };

  const handleDeleteVersion = async (versionId: string) => {
    try {
      setDeletingId(versionId);
      await deleteVersion({ id: skillId, versionId }).unwrap();
      // Remove from cache without refetch
      dispatch(
        api.util.updateQueryData('listSkillVersions', skillId, (draft: SkillVersionDTO[] | undefined) => {
          if (!draft) return;
          const idx = draft.findIndex(v => v.id === versionId);
          if (idx !== -1) draft.splice(idx, 1);
        })
      );
      message.success('Версия удалена');
      // no refetch to avoid spinner
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка удаления версии');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateVersionSubmit = async (data: UpdateSkillVersionDTO) => {
    if (!editingVersion) return;
    try {
      const updated = await updateVersion({ id: skillId, versionId: editingVersion.id, body: data }).unwrap();
      // Optimistically update versions list cache to avoid full rerender
      dispatch(
        api.util.updateQueryData('listSkillVersions', skillId, (draft: SkillVersionDTO[] | undefined) => {
          if (!draft) return;
          const idx = draft.findIndex(v => v.id === editingVersion.id);
          if (idx !== -1) {
            draft[idx] = { ...draft[idx], ...updated } as SkillVersionDTO;
          }
        })
      );
      message.success('Версия обновлена');
      setIsEditModalOpen(false);
      setEditingVersion(null);
      // no hard refetch to keep render minimal
    } catch (error) {
      message.error(extractErrMessage(error) || 'Ошибка обновления версии');
    }
  };

  // Render states
  if (hasError) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Ошибка загрузки"
          description="Не удалось загрузить информацию о версиях навыка"
          type="error"
          showIcon
          action={
            <Button size="small" onClick={handleGoBack}>
              Вернуться к навыку
            </Button>
          }
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleGoBack}
            style={{ marginBottom: '16px' }}
          >
            Вернуться к навыку
          </Button>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start' 
          }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Версии навыка
              </Title>
              <Text type="secondary">
                {skill?.title} • Всего версий: {versions.length}
              </Text>
            </div>
            
            <PermissionButton 
              type="primary" 
              icon={<PlusOutlined />}
              loading={isCreatingVersion}
              onClick={handleCreateVersion}
            >
              Создать версию
            </PermissionButton>
          </div>
        </div>

        {/* Versions list */}
        {versions.length === 0 ? (
          <Empty
            description="Нет версий"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {sortedVersions.map((version: SkillVersionDTO) => (
              <SkillVersionCard
                key={version.id}
                version={version}
                isLatest={version.version === latestVersion}
                totalVersions={versions.length}
                onDownload={handleDownloadVersion}
                onDelete={handleDeleteVersion}
                onEdit={handleEditVersion}
                canDelete={true} // TODO: проверка прав доступа
                isDeleting={deletingId === version.id}
              />
            ))}
          </Space>
        )}
      </Space>

      <CreateVersionModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateVersionSubmit}
        loading={isCreatingVersion}
        skillId={skillId}
      />
      <CreateVersionModal
        open={isEditModalOpen}
        onCancel={() => { setIsEditModalOpen(false); setEditingVersion(null); }}
        onSubmit={handleUpdateVersionSubmit}
        loading={isUpdatingVersion}
        skillId={skillId}
        title="Обновить версию"
        okText="Обновить"
        initialAuthorId={skill?.authorId || undefined}
        initialVerifierId={skill?.verifierId || undefined}
        initialApprovedDate={editingVersion?.approvedDate}
        currentFileName={editingVersion?.files?.[0]?.filename || editingVersion?.files?.[0]?.name}
      />
    </div>
  );
};

export default SkillVersionsContainer;
