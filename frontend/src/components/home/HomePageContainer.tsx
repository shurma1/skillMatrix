import React, { useMemo } from 'react';
import { Typography, Flex } from 'antd';
import { useGetMyServicedSkillsQuery } from '@/store/endpoints';
import { useAppSelector } from '@/hooks/storeHooks';
import UserStatsCard from '@/components/UserStatsCard';
import MySharedStatCard from '@/components/analytics/MySharedStatCard';
import ServicedSkillsSection from './ServicedSkillsSection';
import MySkillsList from './MySkillsList';

const HomePageContainer: React.FC = () => {
  const { data: myServicedSkills = [], isFetching: isServicedSkillsLoading } = useGetMyServicedSkillsQuery(undefined, { refetchOnMountOrArgChange: true });
  const user = useAppSelector(s => s.auth.user);
  const fullName = useMemo(() => {
    if (!user) return '';
    const parts = [
		user?.lastname || '',
      	user?.firstname || '',
		user?.patronymic || ''
    ].filter(Boolean);
    return parts.join(' ');
  }, [user]);

  return (
		<Flex vertical>
    <Typography.Title
      level={3}
      style={{ marginTop: 0, marginBottom: 16 }}
    >
      {fullName || 'Профиль'}
    </Typography.Title>
		
		<UserStatsCard />
    <MySkillsList />

      <div style={{ marginTop: 24 }}>
        <MySharedStatCard />
      </div>

  {myServicedSkills.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <ServicedSkillsSection
            skills={myServicedSkills}
            loading={isServicedSkillsLoading}
          />
        </div>
      )}
    </Flex>
  );
};

export default HomePageContainer;
