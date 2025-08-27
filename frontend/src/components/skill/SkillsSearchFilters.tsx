import { Space, DatePicker } from 'antd';
import PermissionButton from '@/components/shared/PermissionButton';
import { PlusOutlined } from '@ant-design/icons';
import type { FC } from 'react';
import type { Dayjs } from 'dayjs';
import type { UserDTO } from '@/types/api/auth';
import SkillSearchInput from './SkillSearchInput';
import TagSelect from './TagSelect';
import UserSelect from './UserSelect';

interface Tag {
  id: string;
  name: string;
}

interface SkillsSearchFiltersProps {
  query: string;
  tagIds: string[];
  authorIds: string[];
  verifierIds: string[];
  approvedRange: [Dayjs, Dayjs] | null;
  auditRange: [Dayjs, Dayjs] | null;
  tags: Tag[];
  users: UserDTO[];
  isTagsLoading: boolean;
  isUsersLoading: boolean;
  onQueryChange: (query: string) => void;
  onTagIdsChange: (tagIds: string[]) => void;
  onAuthorIdsChange: (authorIds: string[]) => void;
  onVerifierIdsChange: (verifierIds: string[]) => void;
  onApprovedRangeChange: (range: [Dayjs, Dayjs] | null) => void;
  onAuditRangeChange: (range: [Dayjs, Dayjs] | null) => void;
  onCreateClick: () => void;
}

const SkillsSearchFilters: FC<SkillsSearchFiltersProps> = ({
  query,
  tagIds,
  authorIds,
  verifierIds,
  tags,
  users,
  isTagsLoading,
  isUsersLoading,
  onQueryChange,
  onTagIdsChange,
  onAuthorIdsChange,
  onVerifierIdsChange,
  onApprovedRangeChange,
  onAuditRangeChange,
  onCreateClick
}) => (
  <Space wrap style={{ marginBottom: 16 }} size={[16, 16]}>
    <SkillSearchInput
      value={query}
      onChange={onQueryChange}
    />
    
    <TagSelect
      value={tagIds}
      loading={isTagsLoading}
      placeholder="Теги"
      tags={tags}
      onChange={onTagIdsChange}
      style={{ minWidth: 180 }}
    />
    
    <UserSelect
      value={authorIds}
      loading={isUsersLoading}
      placeholder="Авторы"
      users={users}
      onChange={onAuthorIdsChange}
      style={{ minWidth: 220 }}
    />
    
    <UserSelect
      value={verifierIds}
      loading={isUsersLoading}
      placeholder="Проверяющие"
      users={users}
      onChange={onVerifierIdsChange}
      style={{ minWidth: 220 }}
    />
    
    <DatePicker.RangePicker
      onChange={(dates) => onApprovedRangeChange(dates as [Dayjs, Dayjs] | null)}
      placeholder={['Утверждено от', 'Утверждено до']}
    />
    
    <DatePicker.RangePicker
      onChange={(dates) => onAuditRangeChange(dates as [Dayjs, Dayjs] | null)}
      placeholder={['Ревизия от', 'Ревизия до']}
    />
    
    <PermissionButton
      type="primary"
      icon={<PlusOutlined />}
      onClick={onCreateClick}
    >
      Добавить навык
    </PermissionButton>
  </Space>
);

export default SkillsSearchFilters;
