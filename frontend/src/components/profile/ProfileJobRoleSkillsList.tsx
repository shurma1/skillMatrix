import React from 'react';
import { List, Skeleton } from 'antd';
import type { UserSkillSearchDto } from '@/types/api/user';
import { useListProfileSkillsInJobroleQuery } from '@/store/endpoints';
import SkillListItem from '../shared/SkillListItem';

interface ProfileJobRoleSkillsListProps {
  jobroleId: string;
}

const ProfileJobRoleSkillsList: React.FC<ProfileJobRoleSkillsListProps> = ({
  jobroleId
}) => {
  const { data, isFetching } = useListProfileSkillsInJobroleQuery(jobroleId);

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
        />
      )}
    />
  );
};

export default ProfileJobRoleSkillsList;
