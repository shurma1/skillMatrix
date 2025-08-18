import React from 'react';
import { Space } from 'antd';
import { useGetMyJobrolesQuery, useGetMySkillsQuery } from '@/store/endpoints';
import MyJobRolesSection from './MyJobRolesSection';
import MySkillsSection from './MySkillsSection';
import MyJobRoleSkillsList from './MyJobRoleSkillsList';

const DashboardContainer: React.FC = () => {
  const { data: myJobroles = [], isFetching: isJobrolesLoading } = useGetMyJobrolesQuery();
  const { data: mySkills = [], isFetching: isSkillsLoading } = useGetMySkillsQuery();

  const renderJobRoleSkills = (jobroleId: string) => (
    <MyJobRoleSkillsList jobroleId={jobroleId} />
  );

  return (
    <Space direction="vertical" size={32} style={{ width: '100%' }}>
      <MyJobRolesSection
        jobroles={myJobroles}
        loading={isJobrolesLoading}
        jobRoleSkillsComponent={renderJobRoleSkills}
      />
      
      <MySkillsSection
        skills={mySkills}
        loading={isSkillsLoading}
      />
    </Space>
  );
};

export default DashboardContainer;
