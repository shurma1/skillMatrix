import React from 'react';
import { Card, Skeleton, Typography, Space, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { JobRoleDTO } from '@/types/api/jobrole';

const { Title, Text } = Typography;

interface JobRoleInfoCardProps {
  jobRole?: JobRoleDTO;
  loading: boolean;
  onEdit: () => void;
}

const JobRoleInfoCard: React.FC<JobRoleInfoCardProps> = ({
  jobRole,
  loading,
  onEdit
}) => (
  <Card
    title={<Title level={3} style={{ margin: 0 }}>Информация о роли</Title>}
    extra={
      <Button 
        type="primary" 
        icon={<EditOutlined />}
        onClick={onEdit}
        disabled={loading || !jobRole}
      >
        Редактировать
      </Button>
    }
  >
    {loading || !jobRole ? (
      <Skeleton active paragraph={{ rows: 2 }} />
    ) : (
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>{jobRole.title}</Title>
          <Text type="secondary">ID: {jobRole.id}</Text>
        </div>
      </Space>
    )}
  </Card>
);

export default JobRoleInfoCard;
