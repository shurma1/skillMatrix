import React, { useState } from 'react';
import { Typography, Card, List, Tag, Skeleton, Collapse, Avatar, Flex, Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { LinkOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import type { SkillWithCurrentVersionDTO } from '@/types/api/skill';
import type { UserSkillSearchDto } from '@/types/api/user';
import { useListAllSkillUsersQuery, useGetUserTestResultByUserQuery } from '@/store/endpoints';
import { useAppSelector } from '@/hooks/storeHooks';
import SkillProgressBar from '../shared/SkillProgressBar';
import SkillConfirmationsContainer from '../skill/SkillConfirmationsContainer';

const { Title } = Typography;

interface ServicedSkillsSectionProps {
  skills: SkillWithCurrentVersionDTO[];
  loading: boolean;
}

const ServicedSkillsSection: React.FC<ServicedSkillsSectionProps> = ({
  skills,
  loading
}) => {
  const [expandedSkills, setExpandedSkills] = useState<Set<string>>(new Set());
  const me = useAppSelector(s => s.auth.user);

  const handleSkillExpand = (skillId: string, expanded: boolean) => {
    setExpandedSkills(prev => {
      const newSet = new Set(prev);
      if (expanded) {
        newSet.add(skillId);
      } else {
        newSet.delete(skillId);
      }
      return newSet;
    });
  };

  const SkillUsers: React.FC<{ skillId: string; canCurate: boolean }> = ({ skillId, canCurate }) => {
    const {
      data: users = [],
      isFetching: isLoadingUsers
    } = useListAllSkillUsersQuery(skillId, {
      skip: !expandedSkills.has(skillId)
    });

    if (isLoadingUsers) {
      return <Skeleton active paragraph={{ rows: 2 }} />;
    }

    return (
      <List
        dataSource={users}
        renderItem={(user: UserSkillSearchDto) => {
          // fetch user's test result for this skill (if test exists on latest version, it's provided via user.testId)
          const { data: result, isFetching: isLoadingResult } = useGetUserTestResultByUserQuery(
            { testId: user.testId || '', userId: user.userId },
            { skip: !user.testId }
          );
          const initials = [user.lastname, user.firstname]
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
                    {user.lastname} {user.firstname} {user.patronymic}
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
                  {/* Test short results moved to the left side */}
                  {user.testId && (
                    <div style={{ fontSize: 12 }}>
                      {isLoadingResult ? (
                        <Skeleton active title={false} paragraph={{ rows: 1, width: 180 }} />
                      ) : result ? (
                        <div>
                          Тест: {result.score}/{result.needScore}{' '}
                          <Tag color={result.score >= result.needScore ? 'green' : 'red'}>
                            {result.score >= result.needScore ? 'Пройден' : 'Не пройден'}
                          </Tag>
                        </div>
                      ) : (
                        <div style={{ color: '#999' }}>Тест не пройден</div>
                      )}
                    </div>
                  )}
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
                  {user.testId && result && (
                    <Tooltip title="Открыть детальные результаты">
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/test/${user.testId}/result/view?userId=${user.userId}`;
                        }}
                        style={{ marginTop: 4 }}
                      >
                        Детали результата
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </div>
              <SkillProgressBar
                level={user.level}
                target={user.targetLevel}
              />
              <SkillConfirmationsContainer
                userId={user.userId}
                skillId={skillId}
                skillTitle={user.title}
                currentLevel={user.level}
                forceAllowAdd={canCurate}
              />
            </List.Item>
          );
        }}
      />
    );
  };

  return (
    <div>
      <Title level={3}>Курируемые навыки</Title>
      <Card
        title={<span>Навыки ({skills.length})</span>}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <List
            dataSource={skills}
            renderItem={skill => {
        const canCurate = Boolean(me && (me.id === skill.authorId || me.id === skill.verifierId));
        const collapseItems = [
                {
                  key: 'users',
                  label: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <UsergroupAddOutlined />
                      Пользователи с данным навыком
                    </span>
                  ),
          children: <SkillUsers skillId={skill.id} canCurate={canCurate} />
                }
              ];

              return (
                <List.Item style={{ display: 'block', paddingBottom: 16 }}>
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'flex-start',
                      gap: 16,
                      marginBottom: 12
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
                        <Tag color={skill.type === 'document' ? 'blue' : 'green'}>
                          {skill.type === 'document' ? 'Документ' : 'Навык'}
                        </Tag>
                        <Link
                          to={`/skills/${skill.id}`}
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
                        gap: 4,
                        fontSize: 12,
                        color: '#666'
                      }}
                    >
                      <div>Версия: {skill.version}</div>
                      <div>Аудит: {new Date(skill.auditDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <Collapse
                    size="small"
                    ghost
                    items={collapseItems}
                    onChange={(keys) => {
                      const isExpanded = keys.includes('users');
                      handleSkillExpand(skill.id, isExpanded);
                    }}
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default ServicedSkillsSection;
