import React from 'react';
import { Card, Tag, Button, Tooltip, Space, Typography, Popconfirm, theme } from 'antd';
import PermissionButton from '@/components/shared/PermissionButton';
import { DownloadOutlined, DeleteOutlined, CalendarOutlined, EditOutlined } from '@ant-design/icons';
import type { SkillVersionDTO } from '@/types/api/skill';
import { formatDate } from '../../utils/dateHelpers';
import {shortString} from "@/utils/shortString.ts";
import {getFileSize} from "@/utils/getFileSize.ts";

const { Text } = Typography;

interface SkillVersionCardProps {
  version: SkillVersionDTO;
  isLatest: boolean;
  totalVersions: number;
  onDownload: (versionId: string, fileId: string) => void;
  onDelete: (versionId: string) => void;
  onEdit: (version: SkillVersionDTO) => void;
  canDelete: boolean;
  isDeleting: boolean;
}

/**
 * Компонент карточки версии навыка
 * Отображает информацию о версии с возможностью скачивания и удаления
 */
const SkillVersionCard: React.FC<SkillVersionCardProps> = ({
  version,
  isLatest,
  totalVersions,
  onDownload,
  onDelete,
  onEdit,
  canDelete,
  isDeleting
}) => {
  const { token } = theme.useToken();
  const hasFiles = version.files && version.files.length > 0;
  const hasTest = Boolean(version.testId);
  
  // Логика для кнопки удаления:
  // - Нельзя удалить если это единственная версия
  // - Должны быть права на удаление
  const canDeleteVersion = canDelete && totalVersions > 1;

  return (
    <Card
      size="small"
      title={
        <Space>
          <Text strong>Версия {version.version}</Text>
          {isLatest && <Tag color="green">Текущая</Tag>}
          {hasTest && <Tag color="blue">Есть тест</Tag>}
        </Space>
      }
      extra={
        <Space>
          <Tooltip title="Редактировать версию">
            <PermissionButton type="text" icon={<EditOutlined />} onClick={() => onEdit(version)} />
          </Tooltip>
          <Popconfirm
            title="Удалить версию?"
            description={
              isLatest
                ? `Вы удаляете текущую версию ${version.version}. После удаления актуальной станет другая версия. Продолжить?`
                : `Вы уверены, что хотите удалить версию ${version.version}? Это действие нельзя отменить.`
            }
            onConfirm={() => onDelete(version.id)}
            okText="Да, удалить"
            cancelText="Отмена"
            okType="danger"
            disabled={!canDeleteVersion}
          >
            <Tooltip
              title={
                !canDeleteVersion
                  ? totalVersions === 1
                    ? "Нельзя удалить единственную версию"
                    : "Нет прав на удаление"
                  : "Удалить версию"
              }
            >
              <PermissionButton
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={!canDeleteVersion}
                loading={isDeleting}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      }
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Основная информация */}
        <div>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div>
              <Space>
                <CalendarOutlined />
                <Text type="secondary">Утверждено:</Text>
                <Text>{formatDate(version.approvedDate)}</Text>
              </Space>
            </div>
            
            <div>
              <Space>
                <CalendarOutlined />
                <Text type="secondary">Ревизия до:</Text>
                <Text>{formatDate(version.auditDate)}</Text>
              </Space>
            </div>
          </Space>
        </div>

        {/* Файлы */}
        {hasFiles && (
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              Файлы ({version.files.length}):
            </Text>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {version.files.map(file => (
                <Card
                  key={file.id}
                  size="small"
                  style={{ backgroundColor: token.colorFillSecondary }}
                  bodyStyle={{ padding: '8px 12px' }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div>
                        <Text strong>{shortString(file.name)}</Text>
                      </div>
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                         Размер: {getFileSize(file.size)}
                        </Text>
                      </div>
                    </div>
                    <Button
                      type="primary"
                      size="small"
                      icon={<DownloadOutlined />}
                      onClick={() => onDownload(version.id, file.id)}
                    >
                      Скачать
                    </Button>
                  </div>
                </Card>
              ))}
            </Space>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default SkillVersionCard;
