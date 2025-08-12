import React from 'react';
import { Card, Skeleton, List, Button, Popconfirm } from 'antd';
import type { SkillVersionDTO } from '@/types/api/skill';

interface SkillVersionsCardProps {
  versions: SkillVersionDTO[];
  loading: boolean;
  onDeleteVersion: (version: SkillVersionDTO) => void;
  deleting: boolean;
}

const SkillVersionsCard: React.FC<SkillVersionsCardProps> = ({ 
  versions, 
  loading, 
  onDeleteVersion, 
  deleting 
}) => (
  <Card title={`Версии (${versions.length})`}>
    {loading ? (
      <Skeleton active paragraph={{ rows: 3 }} />
    ) : (
      <List
        dataSource={versions}
        renderItem={version => (
          <List.Item 
            actions={[
              <Popconfirm 
                key="delete" 
                title="Удалить версию?" 
                okText="Да" 
                cancelText="Нет" 
                onConfirm={() => onDeleteVersion(version)}
              >
                <Button size="small" danger loading={deleting}>
                  Удалить
                </Button>
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              title={`Версия ${version.version}`}
              description={`Утверждено: ${
                version.approvedDate ? new Date(version.approvedDate).toLocaleDateString() : '—'
              } | Аудит: ${
                version.auditDate ? new Date(version.auditDate).toLocaleDateString() : '—'
              }`}
            />
          </List.Item>
        )}
      />
    )}
  </Card>
);

export default SkillVersionsCard;
