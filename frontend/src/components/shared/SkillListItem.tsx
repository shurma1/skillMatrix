import React, { useCallback, useMemo } from 'react';
import { List, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { LinkOutlined } from '@ant-design/icons';
import SkillProgressBar from './SkillProgressBar';
import type { UserSkillSearchDto } from '@/types/api/user';
import SkillConfirmationsContainer from '../skill/SkillConfirmationsContainer';

export interface SkillListItemProps {
  skill: UserSkillSearchDto;
  showConfirmations?: boolean;
  userId?: string;
  jobroleId?: string; // optional context to target jobrole list updates
}

const SkillListItem: React.FC<SkillListItemProps> = ({
  skill,
  showConfirmations = false,
  userId,
  jobroleId,
}) => {
  const tags = useMemo(() => skill.tags, [skill.tags]);
  const levelsText = useMemo(
    () => `${skill.level}/${skill.targetLevel}`,
    [skill.level, skill.targetLevel]
  );

  const handleOpenSkill = useCallback(() => {
    // no-op: navigation via explicit link button
  }, []);

  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <List.Item
      onClick={handleOpenSkill}
      style={{ display: 'block', paddingBottom: 12 }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'flex-start',
          gap: 16,
        }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <strong
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {skill.title}
            <Link
              to={`/skills/${skill.skillId}`}
              title="Перейти к навыку"
              onClick={stopPropagation}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <LinkOutlined style={{ color: '#1677ff' }} />
            </Link>
          </strong>
          <div>
            {tags.map((tag) => (
              <Tag key={tag.id}>{tag.name}</Tag>
            ))}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 4,
          }}
        >
          <div style={{ fontWeight: 600 }}>{levelsText}</div>
        </div>
      </div>
      <SkillProgressBar level={skill.level} target={skill.targetLevel} />
    {showConfirmations && userId && (
        <SkillConfirmationsContainer
          userId={userId}
          skillId={skill.skillId}
          skillTitle={skill.title}
          currentLevel={skill.level}
      jobroleId={jobroleId}
        />
      )}
    </List.Item>
  );
};

export default React.memo(SkillListItem);
