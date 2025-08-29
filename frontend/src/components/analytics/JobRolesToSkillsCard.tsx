import React from 'react';
import { Card, Alert, Spin, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useLazyDownloadAnalyticsJobRolesToSkillsQuery } from '@/store/endpoints';
import JobRolesToSkillsTable from './JobRolesToSkillsTable';

interface Props {
  data?: {
    left: { colLabels: string[]; data: (string | number | null)[][] };
    right: { colLabels: [string[], number[], number[]]; data: number[][] };
  };
  isFetching: boolean;
  error: any;
}

const JobRolesToSkillsCard: React.FC<Props> = ({ data, isFetching, error }) => {
  const [triggerDownload, { isFetching: isDownloading }] = useLazyDownloadAnalyticsJobRolesToSkillsQuery();

  const handleDownload = async () => {
  const res = await triggerDownload().unwrap().catch(() => undefined as any);
  const payload = res as unknown as { blob: Blob; filename?: string } | undefined;
    if (!payload) return;
    const url = URL.createObjectURL(payload.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = payload.filename || 'jobRolesToSkills.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card title="Навыки по ролям" extra={<Button icon={<DownloadOutlined />} onClick={handleDownload} loading={isDownloading}>Скачать Excel</Button>}>
      {isFetching && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
          <Spin />
        </div>
      )}
      {error && (
        <Alert type="error" message="Ошибка загрузки данных" showIcon style={{ marginBottom: 16 }} />
      )}
      {!isFetching && !error && <JobRolesToSkillsTable data={data} />}
    </Card>
  );
};

export default JobRolesToSkillsCard;
