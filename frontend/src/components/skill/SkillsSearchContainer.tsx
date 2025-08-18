import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Space, message } from 'antd';
import type { Dayjs } from 'dayjs';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useSearchSkillsQuery,
  useSearchTagsQuery,
  useSearchUsersQuery,
  useCreateSkillMutation,
  useAddTagToSkillMutation,
  useUploadFileMutation
} from '@/store/endpoints';
import type { SkillWithCurrentVersionDTO, CreateSkillDTO } from '@/types/api/skill';
import type { TagDTO } from '@/types/api/tag';
import SkillsSearchFilters from '../skill/SkillsSearchFilters';
import SkillsTable from '../skill/SkillsTable';
import CreateSkillModal, { type CreateSkillModalFormData } from '../modals/skill/CreateSkillModal';

const { Title } = Typography;

const SkillsSearchContainer: React.FC = () => {
  const navigate = useNavigate();
  
  // Search state
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 600);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [authorIds, setAuthorIds] = useState<string[]>([]);
  const [verifierIds, setVerifierIds] = useState<string[]>([]);
  const [approvedRange, setApprovedRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [auditRange, setAuditRange] = useState<[Dayjs, Dayjs] | null>(null);

  // Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Data queries
  const { data: tagsResp = [], isFetching: isTagsLoading } = useSearchTagsQuery({ query: '' });
  const tags: TagDTO[] = tagsResp.map(t => ({ id: t.id, name: t.name, skillsCount: 0 }));
  
  const { data: usersResp, isFetching: isUsersLoading } = useSearchUsersQuery({ query: '' });
  const users = usersResp?.rows || [];
  
  const {
    data: skillsResp,
    isFetching: isSkillsLoading,
    refetch: refetchSkills
  } = useSearchSkillsQuery({
    query: debouncedQuery || '',
    limit: pageSize,
    page,
    tags: tagIds.length ? tagIds.join(',') : undefined,
    authorIds: authorIds.length ? authorIds.join(',') : undefined,
    verifierIds: verifierIds.length ? verifierIds.join(',') : undefined,
    approvedDates: approvedRange
      ? approvedRange.map(d => d.format('YYYY-MM-DD')).join(',')
      : undefined,
    auditDates: auditRange
      ? auditRange.map(d => d.format('YYYY-MM-DD')).join(',')
      : undefined,
  });
  
  const skills = skillsResp?.rows || [];
  const total = skillsResp?.count || 0;

  // Deduplicate skills by id to avoid React key warnings
  const uniqueSkills = skills.filter((skill, index, self) => 
    self.findIndex(s => s.id === skill.id) === index
  );

  // Mutations
  const [createSkill, { isLoading: isCreating }] = useCreateSkillMutation();
  const [uploadFile] = useUploadFileMutation();
  const [addTagToSkill] = useAddTagToSkillMutation();

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    debouncedQuery, 
    tagIds.join(','), 
    authorIds.join(','), 
    verifierIds.join(','), 
    approvedRange?.map(d => d.format('YYYY-MM-DD')).join(','),
    auditRange?.map(d => d.format('YYYY-MM-DD')).join(',')
  ]);

  // Event handlers
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleRowClick = useCallback(
    (record: SkillWithCurrentVersionDTO) => {
      navigate(`/skills/${record.id}`);
    },
    [navigate]
  );

  const handleCreate = async (formData: CreateSkillModalFormData) => {
    try {
      const approved = formData.approvedDate;
      let fileId: string | undefined;

      // Handle file upload first if it's a document
      if (formData.type === 'document' && formData.uploadedFile) {
        try {
          const fileDto = await uploadFile({
            name: formData.uploadedFile.name,
            file: formData.uploadedFile
          }).unwrap();
          fileId = fileDto.id;
        } catch {
          message.error('Не удалось загрузить файл');
          return;
        }
      } else if (formData.type === 'document' && !formData.uploadedFile) {
        message.error('Добавьте файл для документа');
        return;
      }

      const values: CreateSkillDTO = {
        type: formData.type,
        title: formData.title,
        verifierId: formData.verifierId,
        authorId: formData.authorId,
        approvedDate: approved
          ? (typeof approved === 'string'
              ? approved
              : approved.toDate().toISOString())
          : '',
        fileId
      };

      const skill = await createSkill(values).unwrap();

      // Add tags to skill
      for (const tagId of formData.selectedTags) {
        try {
          await addTagToSkill({ id: skill.id, tagId }).unwrap();
        } catch {
          // Ignore individual tag errors
        }
      }

      message.success('Навык создан');
      setIsCreateOpen(false);
      refetchSkills();
    } catch {
      message.error('Ошибка создания навыка');
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={24}>
      <Title level={3} style={{ margin: 0 }}>
        Навыки
      </Title>
      
      <SkillsSearchFilters
        query={query}
        tagIds={tagIds}
        authorIds={authorIds}
        verifierIds={verifierIds}
        approvedRange={approvedRange}
        auditRange={auditRange}
        tags={tagsResp}
        users={users}
        isTagsLoading={isTagsLoading}
        isUsersLoading={isUsersLoading}
        onQueryChange={setQuery}
        onTagIdsChange={setTagIds}
        onAuthorIdsChange={setAuthorIds}
        onVerifierIdsChange={setVerifierIds}
        onApprovedRangeChange={setApprovedRange}
        onAuditRangeChange={setAuditRange}
        onCreateClick={() => setIsCreateOpen(true)}
      />
      
      <SkillsTable
        skills={uniqueSkills}
        loading={isSkillsLoading}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onRowClick={handleRowClick}
      />
      
      <CreateSkillModal
        open={isCreateOpen}
        confirmLoading={isCreating}
        users={users}
        tags={tags}
        onCancel={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </Space>
  );
};

export default SkillsSearchContainer;
