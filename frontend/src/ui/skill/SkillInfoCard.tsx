import React from 'react';
import { Card, Skeleton, Button, Typography, Tag, Space } from 'antd';
import type { SkillWithCurrentVersionDTO } from '@/types/api/skill';

interface SkillInfoCardProps { skill?: SkillWithCurrentVersionDTO; loading: boolean; versionCount: number; onOpenVersions: () => void; }
const { Title, Paragraph, Text } = Typography;

const SkillInfoCard: React.FC<SkillInfoCardProps> = ({ skill, loading, versionCount, onOpenVersions }) => (
  <Card title={<Title level={3} style={{ margin: 0 }}>Навык</Title>} extra={<Button onClick={onOpenVersions}>Версии ({versionCount})</Button>}>
    {loading || !skill ? <Skeleton active paragraph={{ rows: 4 }} /> : (
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Title level={4} style={{ margin: 0 }}>{skill.title}</Title>
        <Text type="secondary">Тип: {skill.type === 'document' ? 'Документ' : 'Навык'}</Text>
        <Paragraph style={{ margin: 0 }}>Текущая версия: {skill.version}</Paragraph>
        <Paragraph style={{ margin: 0 }}>Утверждено: {skill.approvedDate ? new Date(skill.approvedDate).toLocaleDateString() : '—'}</Paragraph>
        <Paragraph style={{ margin: 0 }}>Аудит: {skill.auditDate ? new Date(skill.auditDate).toLocaleDateString() : '—'}</Paragraph>
        <Space wrap>
          {(skill.tags ?? []).map(t => <Tag key={t.id}>{t.name}</Tag>)}
        </Space>
      </Space>
    )}
  </Card>
);

export default SkillInfoCard;
