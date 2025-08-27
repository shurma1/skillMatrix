import React from 'react';
import { List, Skeleton } from 'antd';
import type { UserSkillSearchDto } from '@/types/api/user';
import { useListUserSkillsInJobroleQuery } from '@/store/endpoints';
import SkillListItem from '../shared/SkillListItem';

interface JobRoleSkillsListProps {
  userId: string;
  jobroleId: string;
}

const JobRoleSkillsList: React.FC<JobRoleSkillsListProps> = ({
  userId,
  jobroleId
}) => {
  const { data, isFetching } = useListUserSkillsInJobroleQuery({
    id: userId,
    jobroleId
  });

  if (isFetching) {
    return <Skeleton active paragraph={{ rows: 2 }} />;
  }

  if (!data?.length) {
    return <div>Нет навыков</div>;
  }

  return (
    <List
      dataSource={data}
      renderItem={(skill: UserSkillSearchDto) => (
        <SkillListItem
          key={skill.skillId}
          skill={skill}
          showConfirmations
          userId={userId}
          jobroleId={jobroleId}
        />
      )}
    />
  );
};

export default JobRoleSkillsList;
