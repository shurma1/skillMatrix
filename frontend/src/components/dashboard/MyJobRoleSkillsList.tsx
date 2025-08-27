import React from 'react';
import { List, Skeleton } from 'antd';
import type { UserSkillSearchDto } from '@/types/api/user';
import { useGetMySkillsInJobroleQuery } from '@/store/endpoints';
import SkillListItem from '../shared/SkillListItem';

interface MyJobRoleSkillsListProps {
  jobroleId: string;
}

const MyJobRoleSkillsList: React.FC<MyJobRoleSkillsListProps> = ({
  jobroleId
}) => {
  const { data, isFetching } = useGetMySkillsInJobroleQuery(jobroleId);

  if (isFetching) {
    return <Skeleton active paragraph={{ rows: 2 }} />;
  }

  if (!data?.length) {
    return <div>Нет навыков по данной должности</div>;
  }

  return (
    <List
      dataSource={data}
      renderItem={(skill: UserSkillSearchDto) => (
        <SkillListItem
          key={skill.skillId}
          skill={skill}
        />
      )}
    />
  );
};

export default MyJobRoleSkillsList;
