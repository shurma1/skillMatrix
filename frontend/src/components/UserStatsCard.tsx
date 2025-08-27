import React from 'react';
import { Card, Progress, Statistic, Row, Col, Typography, theme } from 'antd';
import { useGetProfileStatsQuery } from '@/store/endpoints';

const { Text } = Typography;

const UserStatsCard: React.FC = () => {
  const { token } = theme.useToken();
  const { data: stats, isLoading, error } = useGetProfileStatsQuery();

  if (isLoading) {
    return (
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card loading={true}>
            <div style={{ height: 60 }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={true}>
            <div style={{ height: 60 }} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={true}>
            <div style={{ height: 60 }} />
          </Card>
        </Col>
      </Row>
    );
  }

  if (error || !stats) {
    return null; // Не показываем карточку при ошибке
  }

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
      <Col xs={24} sm={8}>
        <Card>
          <Statistic
            title="Необходимый уровень"
            value={stats.needLevel}
            valueStyle={{ color: token.colorPrimary }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={8}>
        <Card>
          <Statistic
            title="Ваш уровень"
            value={stats.userLevel}
            valueStyle={{ color: token.colorSuccess }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={8}>
        <Card>
          <Statistic
            title="Прогресс"
            value={stats.percent}
            suffix="%"
            valueStyle={{ 
              color: stats.percent >= 100 
                ? token.colorSuccess 
                : stats.percent >= 75 
                  ? token.colorWarning 
                  : token.colorInfo
            }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default UserStatsCard;
