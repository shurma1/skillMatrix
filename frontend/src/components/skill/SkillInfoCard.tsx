import React from 'react';
import { Card, Skeleton, Typography, Tag, Space, Divider, Button } from 'antd';
import type { SkillWithCurrentVersionDTO } from '@/types/api/skill';
import type { UserDTO } from '@/types/api/auth';
import UserCard from '@/components/shared/UserCard';

const { Title, Paragraph, Text } = Typography;

interface SkillInfoCardProps {
  skill?: SkillWithCurrentVersionDTO;
  loading: boolean;
  author?: UserDTO;
  verifier?: UserDTO;
  loadingUsers: boolean;
  versionCount: number;
  onOpenVersions: () => void;
  onEditSkill: () => void;
  onMakeRevision: () => void;
  canEditSkill: boolean;
  canOpenVersions: boolean;
  canMakeRevision: boolean;
}

const SkillInfoCard: React.FC<SkillInfoCardProps> = ({
  skill,
  loading,
  author,
  verifier,
  loadingUsers,
  versionCount,
  onOpenVersions,
  onEditSkill,
  onMakeRevision,
  canEditSkill,
  canOpenVersions,
  canMakeRevision,
}) => (
  <Card
    title={<Title level={3} style={{ margin: 0 }}>Информация о навыке</Title>}
    extra={
      <Space>
        <Button onClick={onEditSkill} disabled={!canEditSkill}>Изменить навык</Button>
        <Button onClick={onOpenVersions} disabled={!canOpenVersions}>
          Версии ({versionCount})
        </Button>
        <Button onClick={onMakeRevision} disabled={!canMakeRevision}>
          Ревизия
        </Button>
      </Space>
    }
  >
    {loading || !skill ? (
      <Skeleton active paragraph={{ rows: 6 }} />
    ) : (
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>{skill.title}</Title>
          <Text type="secondary">
            Тип: {skill.type === 'document' ? 'Документ' : 'Навык'}
          </Text>
        </div>
        
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Paragraph style={{ margin: 0 }}>
            <Text strong>Текущая версия: </Text>{skill.version}
          </Paragraph>
          <Paragraph style={{ margin: 0 }}>
            <Text strong>Утверждено: </Text>
            {skill.approvedDate ? new Date(skill.approvedDate).toLocaleDateString() : '—'}
          </Paragraph>
          <Paragraph style={{ margin: 0 }}>
            <Text strong>Ревизия: </Text>
            {skill.auditDate ? new Date(skill.auditDate).toLocaleDateString() : '—'}
          </Paragraph>
          <Paragraph style={{ margin: 0 }}>
            <Text strong>Статус: </Text>
            <Tag color={skill.isActive ? 'green' : 'red'}>
              {skill.isActive ? 'Активен' : 'Неактивен'}
            </Tag>
          </Paragraph>
          {skill.type === 'document' && skill.documentId && (
            <Paragraph style={{ margin: 0 }}>
              <Text strong>Номер документа: </Text>
              {skill.documentId}
            </Paragraph>
          )}
        </Space>

        {(skill.tags && skill.tags.length > 0) && (
          <>
            <Divider style={{ margin: 0 }} />
            <div>
              <Text strong>Теги: </Text>
              <div style={{ marginTop: 8 }}>
                <Space wrap>
                  {skill.tags.map(tag => (
                    <Tag key={tag.id}>{tag.name}</Tag>
                  ))}
                </Space>
              </div>
            </div>
          </>
        )}

        <Divider style={{ margin: 0 }} />
        <div>
          <Text strong>Участники</Text>
          <div style={{ marginTop: 8 }}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <div>
                <Text type="secondary">Проверяющий:</Text>
                <div style={{ marginTop: 4 }}>
                  {loadingUsers ? (
                    <Skeleton.Button active size="small" />
                  ) : verifier ? (
                    <UserCard
                      user={verifier}
                      size="small"
                    />
                  ) : (
                    <Text type="secondary">Не указан</Text>
                  )}
                </div>
              </div>
              
              <div>
                <Text type="secondary">Автор:</Text>
                <div style={{ marginTop: 4 }}>
                  {loadingUsers ? (
                    <Skeleton.Button active size="small" />
                  ) : author ? (
                    <UserCard
                      user={author}
                      size="small"
                    />
                  ) : (
                    <Text type="secondary">Не указан</Text>
                  )}
                </div>
              </div>
            </Space>
          </div>
        </div>
      </Space>
    )}
  </Card>
);

export default SkillInfoCard;
