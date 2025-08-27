import React from 'react';
import { Card, Skeleton, List, Popconfirm } from 'antd';
import PermissionButton from '@/components/shared/PermissionButton';
import type { SkillVersionDTO } from '@/types/api/skill';

interface SkillVersionsCardProps { versions: SkillVersionDTO[]; loading: boolean; onDeleteVersion: (v: SkillVersionDTO) => void; deleting: boolean; }

const SkillVersionsCard: React.FC<SkillVersionsCardProps> = ({ versions, loading, onDeleteVersion, deleting }) => (
  <Card title={`Версии (${versions.length})`}>
    {loading ? <Skeleton active paragraph={{ rows: 3 }} /> : (
      <List
        dataSource={versions}
        renderItem={v => (
          <List.Item actions={[
            <Popconfirm key="del" title="Удалить версию?" okText="Да" cancelText="Нет" onConfirm={() => onDeleteVersion(v)}>
              <PermissionButton size="small" danger loading={deleting}>Удалить</PermissionButton>
            </Popconfirm>
          ]}>
            <List.Item.Meta
              title={`Версия ${v.version}`}
              description={`Утверждено: ${v.approvedDate ? new Date(v.approvedDate).toLocaleDateString() : '—'} | Ревизия: ${v.auditDate ? new Date(v.auditDate).toLocaleDateString() : '—'}`}
            />
          </List.Item>
        )}
      />
    )}
  </Card>
);

export default SkillVersionsCard;
