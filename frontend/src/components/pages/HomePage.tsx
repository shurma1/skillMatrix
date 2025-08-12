import React from 'react';
import { Typography, Card, Alert } from 'antd';

const { Title } = Typography;

const HomePage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Главная страница</Title>
      <Card>
        <Alert
          message="Добро пожаловать в систему управления навыками!"
          description="Здесь будет размещена основная информация и статистика."
          type="info"
          showIcon
        />
      </Card>
    </div>
  );
};

export default HomePage;
