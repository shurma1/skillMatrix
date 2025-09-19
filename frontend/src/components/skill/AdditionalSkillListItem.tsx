import React, { useMemo } from 'react';
import { List, Tag, Popconfirm, Skeleton, Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { LinkOutlined } from '@ant-design/icons';
import type { UserSkillSearchDto } from '@/types/api/user';
import SkillProgressBar from '../shared/SkillProgressBar';
import SkillConfirmationsContainer from './SkillConfirmationsContainer';
import PermissionButton from '@/components/shared/PermissionButton';
import { useGetUserTestResultByUserQuery } from '@/store/endpoints';

interface AdditionalSkillListItemProps {
  skill: UserSkillSearchDto;
  userId: string;
  onDelete: (id: string) => void;
  onEditTarget: (skill: { skillId: string; targetLevel: number }) => void;
}

const AdditionalSkillListItem: React.FC<AdditionalSkillListItemProps> = ({
  skill,
  userId,
  onDelete,
  onEditTarget,
}) => {
  const tags = useMemo(() => skill.tags, [skill.tags]);
  
  const hasTest = Boolean(userId && skill.testId);
  const { data: testResult, isFetching: isTestFetching } = useGetUserTestResultByUserQuery(
    { testId: skill.testId || '', userId: userId || '' },
    { skip: !hasTest }
  );
  
  return (
    <List.Item style={{ display: 'block', paddingBottom: 12 }}>
      <div style={{ display: 'flex', width: '100%', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <strong style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {skill.title}
            <Link
              to={`/skills/${skill.skillId}`}
              title="Перейти к навыку"
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              <LinkOutlined style={{ color: '#1677ff' }} />
            </Link>
          </strong>
          <div>
            {tags.map(tag => <Tag key={tag.id}>{tag.name}</Tag>)}
          </div>
          {/* Test summary */}
          {hasTest && (
            <div style={{ fontSize: 12 }}>
              {isTestFetching ? (
                <Skeleton active title={false} paragraph={{ rows: 1, width: 180 }} />
              ) : testResult ? (
                <div>
                  Тест: {testResult.score}/{testResult.needScore}{' '}
                  <Tag color={testResult.score >= testResult.needScore ? 'green' : 'red'}>
                    {testResult.score >= testResult.needScore ? 'Пройден' : 'Не пройден'}
                  </Tag>
                </div>
              ) : (
                <div style={{ color: '#999' }}>Тест не пройден</div>
              )}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ fontWeight: 600 }}>{skill.level}/{skill.targetLevel}</div>
          {hasTest && (
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
              onClick={() => onEditTarget({ skillId: skill.skillId, targetLevel: skill.targetLevel })}
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
      <SkillProgressBar level={skill.level} target={skill.targetLevel} />
      <SkillConfirmationsContainer
        userId={userId}
        skillId={skill.skillId}
        skillTitle={skill.title}
        currentLevel={skill.level}
      />
    </List.Item>
  );
};

export default React.memo(AdditionalSkillListItem, (prev, next) => {
  const a = prev.skill;
  const b = next.skill;
  return (
    prev.userId === next.userId &&
    a.skillId === b.skillId &&
    a.level === b.level &&
    a.targetLevel === b.targetLevel &&
    a.title === b.title &&
    a.isConfirmed === b.isConfirmed &&
    a.isNew === b.isNew &&
    JSON.stringify(a.tags) === JSON.stringify(b.tags)
  );
});
