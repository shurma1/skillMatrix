import React from 'react';
import { SKILL_LEVELS } from './SkillLevelSelect';

interface SkillLevelDisplayProps {
  level: number;
  className?: string;
  style?: React.CSSProperties;
}

const SkillLevelDisplay: React.FC<SkillLevelDisplayProps> = ({
  level,
  className,
  style
}) => {
  const skillLevel = SKILL_LEVELS.find(sl => sl.value === level);
  
  if (!skillLevel) {
    return <span className={className} style={style}>{level}</span>;
  }
  
  return (
    <span className={className} style={style}>
      {skillLevel.label}
    </span>
  );
};

export default SkillLevelDisplay;
