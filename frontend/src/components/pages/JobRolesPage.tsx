import React from 'react';
import { Typography, Card, Alert } from 'antd';

const { Title } = Typography;

const JobRolesPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Должности</Title>
      <Card>
        <Alert
          message="Страница должностей"
          description="Здесь будет размещен список всех должностей и возможность управления ими."
          type="info"
          showIcon
        />
      </Card>
    </div>
  );
};

export default JobRolesPage;
