import React from 'react';
import { Card, Alert, Spin } from 'antd';
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
  return (
    <Card title="Навыки по ролям">
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
