import React from 'react';
import { Typography, Card, Skeleton, List, Tag, Flex } from 'antd';
import { Link } from 'react-router-dom';
import { LinkOutlined } from '@ant-design/icons';
import type { UserSkillSearchDto } from '@/types/api/user';
import SkillProgressBar from '../shared/SkillProgressBar';

const { Title } = Typography;

interface MySkillsSectionProps {
  skills: UserSkillSearchDto[];
  loading: boolean;
}

const MySkillsSection: React.FC<MySkillsSectionProps> = ({
  skills,
  loading
}) => (
  <div>
    <Title level={3}>Мои навыки</Title>
    <Card
      title={`Навыки (${skills.length})`}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : skills.length === 0 ? (
        <p>Навыки не добавлены</p>
      ) : (
        <List
          dataSource={skills}
          renderItem={skill => (
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
      )}
    </Card>
  </div>
);

export default MySkillsSection;
