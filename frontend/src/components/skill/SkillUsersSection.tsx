import React from 'react';
import { Typography, Card, List, Tag, Skeleton, Flex, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { LinkOutlined } from '@ant-design/icons';
import type { UserSkillSearchDto } from '@/types/api/user';
import SkillProgressBar from './SkillProgressBar';

const { Title } = Typography;

interface SkillUsersSectionProps {
  users: UserSkillSearchDto[];
  loading: boolean;
}

const SkillUsersSection: React.FC<SkillUsersSectionProps> = ({
  users,
  loading
}) => (
  <div>
    <Title level={3}>Пользователи с данным навыком</Title>
    <Card
      title={<span>Пользователи ({users.length})</span>}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <List
          dataSource={users}
          renderItem={user => {
            const initials = [user.login, user.firstname, user.patronymic]
              .filter(Boolean)
              .map(p => p[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();
            
            return (
              <List.Item style={{ display: 'block', paddingBottom: 12 }}>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'flex-start',
                    gap: 16
                  }}
                >
                  <Flex vertical style={{ flex: 1 }} gap={4}>
                    <strong
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      <Avatar size={24}>{initials}</Avatar>
                      {user.login} {user.firstname} {user.patronymic}
                      <Link
                        to={`/users/${user.userId}`}
                        title="Перейти к пользователю"
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
                      {user.tags.map((tag) => (
                        <Tag key={tag.id}>{tag.name}</Tag>
                      ))}
                    </div>
                  </Flex>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: 4
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>
                      {user.level}/{user.targetLevel}
                    </div>
                  </div>
                </div>
                <SkillProgressBar
                  level={user.level}
                  target={user.targetLevel}
                />
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  </div>
);

export default SkillUsersSection;
