import React from 'react';
import { List, Tag, Skeleton } from 'antd';
import { Link } from 'react-router-dom';
import { LinkOutlined } from '@ant-design/icons';
import type { UserSkillSearchDto } from '@/types/api/user';
import { useListUserSkillsInJobroleQuery } from '@/store/endpoints';
import SkillProgressBar from './SkillProgressBar';

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
        <List.Item style={{ display: 'block', paddingBottom: 12 }}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'flex-start',
              gap: 16
            }}
          >
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <strong
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {skill.title}
                <Link
                  to={`/skills/${skill.skillId}`}
                  title="Перейти к навыку"
                  onClick={e => e.stopPropagation()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  <LinkOutlined style={{ color: '#1677ff' }} />
                </Link>
              </strong>
              <div>
                {skill.tags.map((tag) => (
                  <Tag key={tag.id}>{tag.name}</Tag>
                ))}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 4
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {skill.level}/{skill.targetLevel}
              </div>
            </div>
          </div>
          <SkillProgressBar
            level={skill.level}
            target={skill.targetLevel}
          />
        </List.Item>
      )}
    />
  );
};

export default JobRoleSkillsList;
