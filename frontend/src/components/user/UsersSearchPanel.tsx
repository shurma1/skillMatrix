// import { Button } from 'antd';
import PermissionButton from '@/components/shared/PermissionButton';
import type { FC } from 'react';
import UserSearchInput from './UserSearchInput';

interface UsersSearchPanelProps {
  query: string;
  loading?: boolean;
  onQueryChange: (query: string) => void;
  onCreateClick: () => void;
}

const UsersSearchPanel: FC<UsersSearchPanelProps> = ({
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
      <UserSearchInput
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
      Добавить нового пользователя
    </PermissionButton>
  </div>
);

export default UsersSearchPanel;
