import React from 'react';
import { Typography, Card, Skeleton, List, Tag, Flex, Popconfirm, Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { LinkOutlined } from '@ant-design/icons';
import type { UserSkillSearchDto } from '@/types/api/user';
import SkillProgressBar from '../shared/SkillProgressBar';
import SkillConfirmationsContainer from './SkillConfirmationsContainer';
import { useGetUserTestResultByUserQuery } from '@/store/endpoints';
import PermissionButton from "@/components/shared/PermissionButton.tsx";

const { Title } = Typography;

interface UserSkillsSectionProps {
  skills: UserSkillSearchDto[];
  loading: boolean;
  userId: string;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onEditTarget: (skill: { skillId: string; targetLevel: number }) => void;
}

const TestSummaryInline: React.FC<{ userId: string; testId: string }> = ({ userId, testId }) => {
  const { data: result, isFetching } = useGetUserTestResultByUserQuery({ testId, userId });
  return (
    <div style={{ fontSize: 12 }}>
      {isFetching ? (
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
  );
};

const UserSkillsSection: React.FC<UserSkillsSectionProps> = ({
  skills,
  loading,
  userId,
  onAdd,
  onDelete,
  onEditTarget
}) => (
  <div>
    <Title level={3}>Дополнительные навыки</Title>
    <Card
      title={<span>Навыки ({skills.length})</span>}
      extra={
        <PermissionButton size="small" onClick={onAdd}>
          Добавить
        </PermissionButton>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
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
                  {/* Test summary on the left */}
                  {skill.testId && (
                    <TestSummaryInline userId={userId} testId={skill.testId} />
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
                    {skill.level}/{skill.targetLevel}
                  </div>
                  {skill.testId && (
                    <Tooltip title="Открыть детальные результаты">
            <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
              window.location.href = `/test/${skill.testId}/result/view?userId=${userId}`;
                        }}
                      >
                        Детали результата
                      </Button>
                    </Tooltip>
                  )}
                  <div style={{ display: 'flex', gap: 4 }}>
                    <PermissionButton
                      size="small"
                      type="link"
                      onClick={() => onEditTarget({
                        skillId: skill.skillId,
                        targetLevel: skill.targetLevel
                      })}
                    >
                      Изменить
                    </PermissionButton>
                    <Popconfirm
                      title="Удалить навык?"
                      okText="Да"
                      cancelText="Нет"
                      onConfirm={() => onDelete(skill.skillId)}
                    >
                      <PermissionButton size="small" type="link" danger>
                        Удалить
                      </PermissionButton>
                    </Popconfirm>
                  </div>
                </div>
              </div>
              <SkillProgressBar
                level={skill.level}
                target={skill.targetLevel}
              />
              <SkillConfirmationsContainer
                userId={userId}
                skillId={skill.skillId}
                skillTitle={skill.title}
                currentLevel={skill.level}
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  </div>
);

export default UserSkillsSection;
