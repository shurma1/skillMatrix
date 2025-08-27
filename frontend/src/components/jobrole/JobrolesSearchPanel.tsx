// import { Button } from 'antd';
import PermissionButton from '@/components/shared/PermissionButton';
import type { FC } from 'react';
import JobRoleSearchInput from './JobRoleSearchInput';

interface JobrolesSearchPanelProps {
  query: string;
  loading?: boolean;
  onQueryChange: (query: string) => void;
  onCreateClick: () => void;
}

const JobrolesSearchPanel: FC<JobrolesSearchPanelProps> = ({
  query,
  loading,
  onQueryChange,
  onCreateClick
}) => (
  <div
    style={{
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      width: '100%',
      marginBottom: 16
    }}
  >
    <div style={{ flex: 1 }}>
      <JobRoleSearchInput
        value={query}
        onChange={onQueryChange}
        loading={loading}
      />
    </div>
    <PermissionButton
      type="primary"
      onClick={onCreateClick}
      style={{ whiteSpace: 'nowrap' }}
    >
      Создать должность
    </PermissionButton>
  </div>
);

export default JobrolesSearchPanel;
