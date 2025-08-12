import React from 'react';
import { Typography, Card, Alert } from 'antd';

const { Title } = Typography;

const ProfilePage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Профиль пользователя</Title>
      <Card>
        <Alert
          message="Страница профиля"
          description="Здесь будет размещена информация о текущем пользователе и его настройки."
          type="info"
          showIcon
        />
      </Card>
    </div>
  );
};

export default ProfilePage;
