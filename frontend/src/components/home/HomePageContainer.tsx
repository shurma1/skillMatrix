import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  List,
  Tag,
  Typography,
  Button,
  Space,
  theme,
  Skeleton,
  Progress,
} from 'antd';
import {
  useGetMyJobrolesQuery,
  useGetMySkillsQuery,
  api,
} from '@/store/endpoints';
import type { UserSkillSearchDto } from '@/types/api/user';
import { useAppDispatch } from '@/hooks/storeHooks';

const { Text } = Typography;

const determineSkillType = (skill: UserSkillSearchDto): 'Навык' | 'Документ' => {
  // Map backend type to label; fallback to 'Навык'.
  return skill.type === 'document' ? 'Документ' : 'Навык';
};

const HomePageContainer: React.FC = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const { data: mySkills, isFetching: isSkillsLoading } = useGetMySkillsQuery();
  const { data: myJobroles, isFetching: isJobrolesLoading } = useGetMyJobrolesQuery();

  const dispatch = useAppDispatch();
  const [roleSkills, setRoleSkills] = useState<Record<string, UserSkillSearchDto[]>>({});
  const [isRoleSkillsLoading, setIsRoleSkillsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;
    const fetchAll = async () => {
      if (!myJobroles || myJobroles.length === 0) {
        setRoleSkills({});
        return;
      }
      setIsRoleSkillsLoading(true);
      try {
        const results = await Promise.all(
          myJobroles.map(async (jr) => {
            const res = (await dispatch(
              api.endpoints.getMySkillsInJobrole.initiate(jr.id)
            ).unwrap()) as UserSkillSearchDto[];
            return { id: jr.id, data: res };
          })
        );
        if (!isCancelled) {
          const map: Record<string, UserSkillSearchDto[]> = {};
          results.forEach(({ id, data }) => { map[id] = data; });
          setRoleSkills(map);
        }
      } finally {
        if (!isCancelled) setIsRoleSkillsLoading(false);
      }
    };
    fetchAll();
    return () => { isCancelled = true; };
  }, [dispatch, myJobroles]);

  const { items, loading } = useMemo(() => {
    const jobroleSkillsMap = new Map<string, Set<string>>();
    (myJobroles || []).forEach((jr) => {
      const list = roleSkills[jr.id] || [];
      list.forEach((s) => {
        if (!jobroleSkillsMap.has(s.skillId)) {
          jobroleSkillsMap.set(s.skillId, new Set<string>());
        }
        jobroleSkillsMap.get(s.skillId)!.add(jr.title);
      });
    });

    const mergedById = new Map<string, UserSkillSearchDto>();
    (mySkills || []).forEach((s) => mergedById.set(s.skillId, s));
    Object.values(roleSkills).forEach((list) => {
      list.forEach((s) => { if (!mergedById.has(s.skillId)) mergedById.set(s.skillId, s); });
    });

    const itemsList = Array.from(mergedById.values()).map((us) => ({
      us,
      jobroleTags: Array.from(jobroleSkillsMap.get(us.skillId) || []),
    }) as const);

    // Sort: new skills first (isNew === true)
    itemsList.sort((a, b) => {
      const ai = a.us.isNew ? 0 : 1;
      const bi = b.us.isNew ? 0 : 1;
      return ai - bi;
    });

    const isLoading = isSkillsLoading || isJobrolesLoading || isRoleSkillsLoading;
    return { items: itemsList, loading: isLoading };
  }, [myJobroles, roleSkills, mySkills, isSkillsLoading, isJobrolesLoading, isRoleSkillsLoading]);

  const handleGoToSkill = useCallback((id: string) => navigate(`/skills/${id}`), [navigate]);

  return (
    <Space direction="vertical" size={24} style={{ width: '100%', padding: 24 }}>
      <Card title="Мои навыки">
        <List
          dataSource={items}
          loading={loading}
          renderItem={({ us, jobroleTags }) => {
            const type = determineSkillType(us);
            const isTargetReached = us.level >= us.targetLevel;
            const isExpired: boolean = 'isExpired' in us ? Boolean((us as unknown as { isExpired?: boolean }).isExpired) : false; // TODO: backend support needed

            // Visual priority: New > Expired > Confirmed > Neutral
            const borderColor = us.isNew
              ? token.colorInfo
              : isExpired
                ? token.colorError
                : us.isConfirmed
                  ? token.colorSuccess
                  : token.colorBorder;

            const safeTarget = Math.max(1, us.targetLevel || 1);
            return (
              <List.Item
                actions={[
                  <Button
                    key="go"
                    type="primary"
                    onClick={() => handleGoToSkill(us.skillId)}
                  >
                    Перейти
                  </Button>
                ]}
                style={{
                  background: token.colorBgContainer,
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 12,
                  border: `1px solid ${borderColor}`,
                }}
              >
                <List.Item.Meta
                  title={
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                      <Text strong>{us.title}</Text>
                      <Tag color="default">{type}</Tag>
                      {jobroleTags.map((jr) => (
                        <Tag key={jr} color="blue">{jr}</Tag>
                      ))}
                      {us.isNew && (
                        <Text style={{ color: token.colorInfo }}>(Новый)</Text>
                      )}
                      {!us.isNew && isExpired && (
                        <Text style={{ color: token.colorError }}>(Просрочен)</Text>
                      )}
                      {/* Target reached is indicated by the progress status; no extra tag/text */}
                    </div>
                  }
                  description={
                    <div style={{ width: '100%', marginTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <Progress
                            percent={Math.round((us.level / Math.max(safeTarget, us.level)) * 100)}
                            steps={Math.max(safeTarget, us.level)}
                            size={[50, 5]}
                            status={isTargetReached ? 'success' : 'active'}
                            strokeColor={
                              us.level > safeTarget
                                ? Array.from({ length: Math.max(safeTarget, us.level) }, (_, i) =>
                                    i < safeTarget ? token.colorInfo : token.colorSuccess
                                  )
                                : undefined
                            }
                          />
                        </div>
                        <Text type="secondary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                          {us.level}/{safeTarget}
                        </Text>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
  {loading && (
          <Skeleton active paragraph={{ rows: 3 }} />
        )}
      </Card>
    </Space>
  );
};

export default HomePageContainer;
