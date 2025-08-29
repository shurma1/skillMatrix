import React, { useState } from 'react';
import { Card, Button, Space, Typography } from 'antd';
import { EyeOutlined, BarChartOutlined, DownloadOutlined } from '@ant-design/icons';
import { useGetMySharedStatQuery, useLazyDownloadMySharedStatQuery } from '@/store/endpoints';
import Loader from '@/components/Loader';
import AnalyticsUserToSkillsTable from '@/components/analytics/AnalyticsUserToSkillsTable';

const { Text } = Typography;

/**
 * Wrapper that reuses the same table UI as UserToSkillsCard but sources data from /api/me/sharedStat.
 * We achieve reuse by lightly copying the rendering logic: since UserToSkillsCard internally calls a hook, we can't override its data easily.
 * To avoid code duplication, we render a small shim that mimics the UserToSkillsCard UX: lazy load and header with summary, then a table component extracted in that file.
 * Simpler path: Render a minimal header and embed a hidden UserToSkillsCard would fetch by userId; but we don't have userId here and endpoint is different.
 * So we implement a similar structure inline here, with identical visual output.
 */
const MySharedStatCard: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const { data, isFetching, error } = useGetMySharedStatQuery(undefined, { skip: !expanded });
  const [triggerDownload, { isFetching: isDownloading }] = useLazyDownloadMySharedStatQuery();

  return (
    <Card
      title={
        <Space>
          <BarChartOutlined />
          <span>Моя аналитика навыков</span>
          {data?.summary && (
            <Text type="secondary">(Общий прогресс: {data.summary.totalPercent}%)</Text>
          )}
        </Space>
      }
      extra={
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={async () => {
              const res = await triggerDownload().unwrap().catch(() => undefined as any);
              const payload = res as unknown as { blob: Blob; filename?: string } | undefined;
              if (!payload) return;
              const url = URL.createObjectURL(payload.blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = payload.filename || 'mySkills.xlsx';
              a.click();
              URL.revokeObjectURL(url);
            }}
            loading={isDownloading}
          >
            Скачать Excel
          </Button>
          <Button type="primary" icon={<EyeOutlined />} onClick={() => setExpanded((e) => !e)} loading={isFetching}>
            {expanded ? 'Скрыть' : 'Показать аналитику'}
          </Button>
        </Space>
      }
      size="small"
    >
      {expanded && (
        <>
          {isFetching && <Loader />}
          {error && (
            <div style={{ textAlign: 'center', padding: 16 }}>
              <Text type="danger">Ошибка загрузки данных</Text>
            </div>
          )}
          {data && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <Space size="large">
                  <Text>
                    <strong>Цель:</strong> {data.summary.totalTargetLevel}
                  </Text>
                  <Text>
                    <strong>Текущий уровень:</strong> {data.summary.totalCurrentLevel}
                  </Text>
                  <Text>
                    <strong>Прогресс:</strong> {data.summary.totalPercent}%
                  </Text>
                </Space>
              </div>
              <AnalyticsUserToSkillsTable data={{ left: data.left, middle: data.middle, right: data.right }} />
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default MySharedStatCard;
