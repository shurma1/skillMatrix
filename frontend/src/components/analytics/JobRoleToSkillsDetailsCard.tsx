import React, { useState, useCallback } from 'react';
import { Card, Select, Alert, Spin, Space, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useSearchJobRolesQuery, useDownloadAnalyticsJobRoleToSkillsQuery } from '@/store/endpoints';
import JobRoleToSkillsDetailsTable from './JobRoleToSkillsDetailsTable';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface JobRoleToSkillsDetailsData {
  left: { colLabels: string[]; data: (string | number | null)[][] };
  middle: { colLabels: [string[], string[], number[]]; data: number[][] };
  right: { colLabels: [string[], number[], number[]]; data: number[][] };
}

interface Props {
  data?: JobRoleToSkillsDetailsData;
  isFetching: boolean;
  error?: FetchBaseQueryError | SerializedError;
  selectedJobRoleId?: string;
  onJobRoleChange: (jobRoleId: string) => void;
}

const JobRoleToSkillsDetailsCard: React.FC<Props> = ({ 
  data, 
  isFetching, 
  error, 
  selectedJobRoleId,
  onJobRoleChange 
}) => {
  const [jobRoleSearchQuery, setJobRoleSearchQuery] = useState('');

  // Поиск должностей для селектора
  const { 
    data: jobRolesData, 
    isFetching: isJobRolesFetching 
  } = useSearchJobRolesQuery(
    { query: jobRoleSearchQuery, limit: 50 },
    { skip: false }
  );

  const handleJobRoleSearch = useCallback((value: string) => {
    setJobRoleSearchQuery(value);
  }, []);

  const handleJobRoleSelect = useCallback((value: string) => {
    onJobRoleChange(value);
  }, [onJobRoleChange]);

  const { refetch: refetchDownload, isFetching: isDownloading } = useDownloadAnalyticsJobRoleToSkillsQuery(
    selectedJobRoleId ? { jobRoleId: selectedJobRoleId } : (undefined as any),
    { skip: !selectedJobRoleId }
  );

  if (error) {
    return (
      <Card>
        <Alert 
          message="Ошибка загрузки данных" 
          description={
            'status' in error 
              ? `Ошибка ${error.status}: ${error.data}` 
              : error.message
          }
          type="error" 
          showIcon 
        />
      </Card>
    );
  }

  return (
    <Card 
      title="Детализация навыков по должности"
      extra={
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={async () => {
              const res = await refetchDownload();
              const payload = res.data as unknown as { blob: Blob; filename?: string } | undefined;
              if (!payload) return;
              const url = URL.createObjectURL(payload.blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = payload.filename || 'jobRoleToSkills.xlsx';
              a.click();
              URL.revokeObjectURL(url);
            }}
            loading={isDownloading}
            disabled={!selectedJobRoleId}
          >
            Скачать Excel
          </Button>
          <Select
            showSearch
            placeholder="Выберите должность"
            style={{ width: 300 }}
            value={selectedJobRoleId}
            onSearch={handleJobRoleSearch}
            onSelect={handleJobRoleSelect}
            loading={isJobRolesFetching}
            filterOption={false}
            notFoundContent={isJobRolesFetching ? <Spin size="small" /> : null}
          >
            {jobRolesData?.rows?.map((jobRole) => (
              <Select.Option key={jobRole.id} value={jobRole.id}>
                {jobRole.title}
              </Select.Option>
            ))}
          </Select>
        </Space>
      }
    >
      {isFetching ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : data ? (
        <JobRoleToSkillsDetailsTable data={data} />
      ) : selectedJobRoleId ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#666' }}>
          Нет данных для отображения
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#666' }}>
          Выберите должность для отображения данных
        </div>
      )}
    </Card>
  );
};

export default JobRoleToSkillsDetailsCard;
