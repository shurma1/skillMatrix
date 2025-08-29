import React, { useState } from 'react';
import { Card, Button, Space, Typography } from 'antd';
import { BarChartOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';
import { useGetAnalyticsUserToSkillsQuery, useLazyDownloadAnalyticsUserToSkillsQuery } from '@/store/endpoints';
import Loader from '@/components/Loader';
import AnalyticsUserToSkillsTable from '@/components/analytics/AnalyticsUserToSkillsTable';

const { Text, Title } = Typography;

interface UserToSkillsCardProps {
  userId: string;
}

const UserToSkillsCard: React.FC<UserToSkillsCardProps> = ({ userId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    data: analyticsData,
    isFetching,
    error
  } = useGetAnalyticsUserToSkillsQuery(userId, {
    skip: !isExpanded
  });

  const [triggerDownload, { isFetching: isDownloading }] = useLazyDownloadAnalyticsUserToSkillsQuery();


  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const renderTable = () => analyticsData ? (
    <AnalyticsUserToSkillsTable data={{ left: analyticsData.left, middle: analyticsData.middle, right: analyticsData.right }} />
  ) : null;

  const handleDownload = async () => {
    const res = await triggerDownload(userId).unwrap().catch(() => undefined as any);
    const payload = res as unknown as { blob: Blob; filename?: string } | undefined;
    if (!payload) return;
    const url = URL.createObjectURL(payload.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = payload.filename || 'userToSkills.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card
      title={
        <Space>
          <BarChartOutlined />
          <span>Аналитика навыков пользователя</span>
          {analyticsData?.summary && (
            <Text type="secondary">
              (Общий прогресс: {analyticsData.summary.totalPercent}%)
            </Text>
          )}
        </Space>
      }
      extra={
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleDownload} loading={isDownloading}>
            Скачать Excel
          </Button>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={handleToggle}
            loading={isFetching}
          >
            {isExpanded ? 'Скрыть' : 'Показать аналитику'}
          </Button>
        </Space>
      }
      size="small"
    >
      {isExpanded && (
        <>
          {isFetching && <Loader />}
          {error && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Text type="danger">Ошибка загрузки данных</Text>
            </div>
          )}
          {analyticsData && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>
                  Навыки пользователя: {analyticsData.user.lastname} {analyticsData.user.firstname} {analyticsData.user.patronymic}
                </Title>
                <Space size="large">
                  <Text>
                    <strong>Цель:</strong> {analyticsData.summary.totalTargetLevel}
                  </Text>
                  <Text>
                    <strong>Текущий уровень:</strong> {analyticsData.summary.totalCurrentLevel}
                  </Text>
                  <Text>
                    <strong>Прогресс:</strong> {analyticsData.summary.totalPercent}%
                  </Text>
                </Space>
              </div>
              {renderTable()}
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default UserToSkillsCard;
