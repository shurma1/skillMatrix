import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Space } from 'antd';
import { 
  useGetSkillQuery, 
  useListSkillVersionsQuery,
  useCreateTestMutation, 
  useGetTestQuery,
  useGetUserQuery,
  useGetFileInfoQuery,
  useGetTestResultQuery,
  useGetMyJobrolesQuery,
  useGetMySkillsQuery,
  useSearchTagsQuery,
  useUpdateSkillMutation,
  useGetProfileQuery,
  useMakeRevisionMutation,
  api,
} from '@/store/endpoints';
import { useAppDispatch } from '@/hooks/storeHooks';
import { usePermissions } from '@/hooks/usePermissions';
import type { SkillWithCurrentVersionDTO, UpdateSkillDTO, MakeRevisionDTO } from '@/types/api/skill';
import type { PreviewTestDto, CreateTestDTO } from '@/types/api/test';
import type { UserSkillSearchDto } from '@/types/api/user';
import type { TagDTO } from '@/types/api/tag';
import SkillInfoCard from './SkillInfoCard';
import SkillTestCard from './SkillTestCard';
import FileCard from './FileCard';
import SkillToUsersCard from '@/components/analytics/SkillToUsersCard';
import EditSkillModal from '@/components/modals/skill/EditSkillModal';
import MakeRevisionModal from '@/components/modals/skill/MakeRevisionModal';
// no duplicate imports

const SkillContainer: React.FC = () => {
  const { skillId = '' } = useParams<{ skillId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { hasPermission } = usePermissions();

  // no direct user usage here

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

  // Получаем результаты теста по testId (для текущего пользователя)
  const {
    data: userTestResult,
    isFetching: isUserTestResultLoading,
  } = useGetTestResultQuery(skill?.testId as string, { skip: !skill?.testId });

  // My job roles (to update jobrole skills caches on view and для поиска уровня навыка по должностям)
  const { data: myJobroles } = useGetMyJobrolesQuery();

  // Совокупные навыки текущего пользователя (включая профильные и по должностям)
  const { data: mySkills } = useGetMySkillsQuery();
  // Базовый поиск навыка среди агрегированных (профильные + должностные) навыков пользователя
  const mySkillRow = useMemo(() => (mySkills || []).find(s => s.skillId === skillId), [mySkills, skillId]);

  // Если навыка нет в общей выдаче /api/me/skills, дополнительно ищем его в навыках по должностям
  const [jobroleSkillRow, setJobroleSkillRow] = useState<UserSkillSearchDto | undefined>();

  useEffect(() => {
    if (!skillId || !myJobroles || myJobroles.length === 0) return;
    // Если уже нашли навык в общей выдаче, сбрасываем локальное состояние и не ищем дальше
    if (mySkillRow) {
      if (jobroleSkillRow) setJobroleSkillRow(undefined);
      return;
    }
    let cancelled = false;
    (async () => {
      for (const jr of myJobroles) {
        try {
          const res = await dispatch(
            api.endpoints.getMySkillsInJobrole.initiate(jr.id)
          ).unwrap();
          const found = res.find((s) => s.skillId === skillId);
          if (found) {
            if (!cancelled) setJobroleSkillRow(found);
            break;
          }
        } catch {
          // пропускаем ошибки отдельных запросов, продолжаем
        }
      }
    })();
    return () => { cancelled = true; };
  }, [dispatch, myJobroles, skillId, mySkillRow, jobroleSkillRow]);

  // Эффективная строка навыка с учётом поиска по должностям
  const effectiveSkillRow = mySkillRow || jobroleSkillRow;

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
  const [updateSkill, { isLoading: isUpdatingSkill }] = useUpdateSkillMutation();
  const [makeRevision, { isLoading: isMakingRevision }] = useMakeRevisionMutation();

  const { data: tagSearch = [] } = useSearchTagsQuery({ query: '' });
  const allTags: TagDTO[] = useMemo(() => {
    const fetched = (tagSearch as unknown as TagDTO[]) || [];
    const skillTags = (skill?.tags as TagDTO[] | undefined) || [];
    const map = new Map<string, TagDTO>();
    [...skillTags, ...fetched].forEach(t => { if (t && t.id) map.set(t.id, t); });
    return Array.from(map.values());
  }, [tagSearch, skill?.tags]);

  // Get current user profile
  const { data: currentUser } = useGetProfileQuery();

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  // Revision modal state
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);

  // Mark skill as seen (isNew = false) in RTK Query caches when visiting Skill page
  useEffect(() => {
    if (!skillId) return;
    try {
      // Update general my skills cache
      dispatch(
        api.util.updateQueryData('getMySkills', undefined, (draft: UserSkillSearchDto[] | undefined) => {
          const found = draft?.find((s) => s.skillId === skillId);
          if (found) found.isNew = false;
        })
      );
      // Update each jobrole skills cache
      (myJobroles || []).forEach((jr) => {
        dispatch(
          api.util.updateQueryData('getMySkillsInJobrole', jr.id, (draft: UserSkillSearchDto[] | undefined) => {
            const found = draft?.find((s) => s.skillId === skillId);
            if (found) found.isNew = false;
          })
        );
      });
    } catch {}
  }, [dispatch, skillId, myJobroles]);

  // Computed values
  const hasTest = Boolean(skill?.testId);
  const hasFile = Boolean(skill?.fileId);
  const loadingUsers = isAuthorLoading || isVerifierLoading;
  const versionCount = versions.length;
  const canTakeTestByLevel = useMemo(() => {
    const lvl = effectiveSkillRow?.level ?? 0;
    const target = effectiveSkillRow?.targetLevel;
    if (target === 1) return false;
    return lvl >= 1 && lvl < 3;
  }, [effectiveSkillRow?.level, effectiveSkillRow?.targetLevel]);
  const canSeeAnalytics = Boolean(
    skillId && hasPermission('ANALYTICS_VIEW')
  );
  const canEditSkill = hasPermission('EDIT_ALL');
  const canOpenVersions = hasPermission('VIEW_ALL');
  
  // Проверяем доступность кнопки ревизии
  const canMakeRevision = useMemo(() => {
    if (!skill || !currentUser) return false;
    
    // Пользователи с правами "EDIT_ALL" могут проводить ревизию
    if (hasPermission('EDIT_ALL')) return true;
    
    // Авторы и проверяющие могут проводить ревизию
    if (skill.authorId === currentUser.id || skill.verifierId === currentUser.id) {
      // Проверяем что текущая дата больше чем (дата ревизии - один месяц)
      if (skill.auditDate) {
        const auditDate = new Date(skill.auditDate);
        const oneMonthBefore = new Date(auditDate);
        oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);
        const now = new Date();
        return now > oneMonthBefore;
      }
      return true; // Если даты ревизии нет, то можно проводить ревизию
    }
    
    return false;
  }, [skill, currentUser, hasPermission]);
  const takeTestDisabledReason = useMemo(() => {
    if (!effectiveSkillRow) return 'Кнопка доступна только при уровне подтверждения 1–2.';
    if (effectiveSkillRow.targetLevel === 1) return 'Недоступно: требуемый уровень для пользователя — 1.';
    const lvl = effectiveSkillRow.level ?? 0;
    if (lvl < 1 || lvl >= 3) return 'Кнопка доступна только при уровне подтверждения 1–2.';
    return undefined;
  }, [effectiveSkillRow]);

  // Event handlers
  const handleOpenVersions = useCallback(() => {
    navigate(`/skills/${skillId}/versions`);
  }, [navigate, skillId]);

  const handleOpenEdit = useCallback(() => setIsEditOpen(true), []);
  const handleCloseEdit = useCallback(() => setIsEditOpen(false), []);

  const handleOpenRevision = useCallback(() => setIsRevisionOpen(true), []);
  const handleCloseRevision = useCallback(() => setIsRevisionOpen(false), []);

  const handleSubmitEdit = useCallback(async (values: UpdateSkillDTO) => {
    if (!skillId) return;
    try {
      await updateSkill({ id: skillId, body: values }).unwrap();
      message.success('Навык обновлён');
      setIsEditOpen(false);
    } catch {
      message.error('Ошибка при обновлении навыка');
    }
  }, [skillId, updateSkill]);

  const handleSubmitRevision = useCallback(async (values: MakeRevisionDTO) => {
    try {
      await makeRevision(values).unwrap();
      message.success('Ревизия проведена успешно');
      setIsRevisionOpen(false);
    } catch {
      message.error('Ошибка при проведении ревизии');
    }
  }, [makeRevision]);

  const handleCreateTest = useCallback(async (data: CreateTestDTO) => {
    try {
      await createTest({ skillId, ...data }).unwrap();
      message.success('Тест создан');
      refetchTest();
    } catch {
      message.error('Ошибка создания теста');
    }
  }, [createTest, refetchTest, skillId]);

  const handleDeleteTest = useCallback(async () => {
    // API для удаления теста не существует
    message.error('Удаление тестов пока не поддерживается');
  }, []);


  const handleEditTest = useCallback(() => {
    if (skill?.testId) {
      navigate(`/skills/${skillId}/test/${skill.testId}/edit`);
    }
  }, [navigate, skill?.testId, skillId]);

  const handleTakeTest = useCallback(() => {
    if (skill?.testId) {
      navigate(`/test/${skill.testId}/take`);
    }
  }, [navigate, skill?.testId]);

  const handleGoToCreateTest = useCallback(() => {
    navigate(`/skills/${skillId}/test/create`);
  }, [navigate, skillId]);

  const handleViewTestResults = useCallback(() => {
    if (skill?.testId) {
      navigate(`/test/${skill.testId}/result/view`);
    }
  }, [navigate, skill?.testId]);

  // removed unused handleGoToTest

  // duplicate effect removed (handled above)

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
        onEditSkill={handleOpenEdit}
        onMakeRevision={handleOpenRevision}
        canEditSkill={canEditSkill}
        canOpenVersions={canOpenVersions}
        canMakeRevision={canMakeRevision}
      />
      <EditSkillModal
        open={isEditOpen}
        confirmLoading={isUpdatingSkill}
        skill={skill as SkillWithCurrentVersionDTO | undefined}
        tags={allTags}
        onCancel={handleCloseEdit}
        onSubmit={handleSubmitEdit}
      />
      
      <MakeRevisionModal
        open={isRevisionOpen}
        confirmLoading={isMakingRevision}
        skillId={skillId}
        currentAuditDate={skill?.auditDate}
        onCancel={handleCloseRevision}
        onSubmit={handleSubmitRevision}
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
        userTestResult={userTestResult}
        isUserTestResultLoading={isUserTestResultLoading}
        onCreateTest={handleCreateTest}
        onDeleteTest={handleDeleteTest}
        onEditTest={handleEditTest}
        onTakeTest={handleTakeTest}
        onGoToCreateTest={handleGoToCreateTest}
        onViewTestResults={handleViewTestResults}
  canTakeTest={canTakeTestByLevel}
  takeTestDisabledReason={takeTestDisabledReason}
      />

  {/* Analytics: Users by Skill (visible only with ANALYTICS_VIEW permission) */}
  {canSeeAnalytics && <SkillToUsersCard skillId={skillId} />}
    </Space>
  );
};

export default SkillContainer;
