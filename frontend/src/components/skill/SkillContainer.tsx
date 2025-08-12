import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Space } from 'antd';
import { 
  useGetSkillQuery, 
  useListSkillVersionsQuery,
  useCreateTestMutation, 
  useGetTestQuery,
  useGetUserQuery,
  useGetFileInfoQuery
} from '@/store/endpoints';
import type { SkillWithCurrentVersionDTO } from '@/types/api/skill';
import type { PreviewTestDto, CreateTestDTO } from '@/types/api/test';
import SkillInfoCard from './SkillInfoCard';
import SkillTestCard from './SkillTestCard';
import FileCard from './FileCard';

const SkillContainer: React.FC = () => {
  const { skillId = '' } = useParams<{ skillId: string }>();
  const navigate = useNavigate();

  // API queries
  const { 
    data: skill, 
    isFetching: isSkillLoading 
  } = useGetSkillQuery(skillId, { skip: !skillId });

  const { 
    data: versions = []
  } = useListSkillVersionsQuery(skillId, { skip: !skillId });

  const { 
    data: test, 
    isFetching: isTestLoading,
    refetch: refetchTest 
  } = useGetTestQuery(skill?.testId as string, { skip: !skill?.testId });

  // User queries для автора и проверяющего
  const { 
    data: author, 
    isFetching: isAuthorLoading 
  } = useGetUserQuery(skill?.authorId as string, { skip: !skill?.authorId });

  const { 
    data: verifier, 
    isFetching: isVerifierLoading 
  } = useGetUserQuery(skill?.verifierId as string, { skip: !skill?.verifierId });

  // File queries
  const { 
    data: fileInfo, 
    isFetching: isFileInfoLoading 
  } = useGetFileInfoQuery(skill?.fileId as string, { skip: !skill?.fileId });

  // API mutations
  const [createTest, { isLoading: isCreatingTest }] = useCreateTestMutation();

  // Computed values
  const hasTest = Boolean(skill?.testId);
  const hasFile = Boolean(skill?.fileId);
  const loadingUsers = isAuthorLoading || isVerifierLoading;
  const versionCount = versions.length;

  // Event handlers
  const handleOpenVersions = () => {
    navigate(`/skills/${skillId}/versions`);
  };

  const handleCreateTest = async (data: CreateTestDTO) => {
    try {
      await createTest({ skillId, ...data }).unwrap();
      message.success('Тест создан');
      refetchTest();
    } catch {
      message.error('Ошибка создания теста');
    }
  };

  const handleDeleteTest = async () => {
    // API для удаления теста не существует
    message.error('Удаление тестов пока не поддерживается');
  };

  const handleOpenTest = () => {
    if (skill?.testId) {
      navigate(`/tests/${skill.testId}`);
    }
  };

  const handleEditTest = () => {
    if (skill?.testId) {
      navigate(`/skills/${skillId}/test/${skill.testId}/edit`);
    }
  };

  const handleTakeTest = () => {
    if (skill?.testId) {
      navigate(`/test/${skill.testId}/take`);
    }
  };

  const handleGoToCreateTest = () => {
    navigate(`/skills/${skillId}/test/create`);
  };

  const handleGoToTest = () => {
    if (skill?.testId) {
      navigate(`/tests/${skill.testId}`);
    }
  };

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <SkillInfoCard 
        skill={skill as SkillWithCurrentVersionDTO | undefined}
        loading={isSkillLoading}
        author={author}
        verifier={verifier}
        loadingUsers={loadingUsers}
        versionCount={versionCount}
        onOpenVersions={handleOpenVersions}
      />
      
      {hasFile && (
        <FileCard
          fileInfo={fileInfo}
          loading={isFileInfoLoading}
          skillId={skillId}
        />
      )}
      
      <SkillTestCard
        test={test as PreviewTestDto | undefined}
        hasTest={hasTest}
        loading={isTestLoading}
        creating={isCreatingTest}
        deleting={false}
        onCreateTest={handleCreateTest}
        onDeleteTest={handleDeleteTest}
        onOpenTest={handleOpenTest}
        onEditTest={handleEditTest}
        onTakeTest={handleTakeTest}
        onGoToCreateTest={handleGoToCreateTest}
        onRefresh={refetchTest}
      />
    </Space>
  );
};

export default SkillContainer;
