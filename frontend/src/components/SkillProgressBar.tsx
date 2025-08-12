import React from 'react';
import { skillProgressRatio } from '@/utils/skill';

interface SkillProgressBarProps {
  level: number;
  target: number;
  height?: number;
}

const SkillProgressBar: React.FC<SkillProgressBarProps> = ({
  level,
  target,
  height = 8
}) => {
  const ratio = skillProgressRatio(level, target);
  
  return (
    <div
      style={{
        position: 'relative',
        marginTop: 8,
        height,
        borderRadius: height / 2,
        overflow: 'hidden',
        background: 'rgba(255,77,79,0.35)'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: `${(ratio * 100).toFixed(2)}%`,
          background: 'rgba(82,196,26,0.85)',
          transition: 'width .4s'
        }}
      />
    </div>
  );
};

export default SkillProgressBar;
