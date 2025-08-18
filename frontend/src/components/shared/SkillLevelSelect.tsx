import React from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';

export const SKILL_LEVELS = [
  { value: 1, label: '1 - Начальный' },
  { value: 2, label: '2 - Продвинутый' },
  { value: 5, label: '5 - Автор' }
];

export const FULL_SKILL_LEVELS = [
  { value: 0, label: '0 - Отсутствует' },
  ...SKILL_LEVELS
];

export type SkillLevel = 0 | 1 | 2 | 5;

interface SkillLevelSelectProps extends Omit<SelectProps<number>, 'options'> {
  placeholder?: string;
  isFull?: boolean;
}

const SkillLevelSelect: React.FC<SkillLevelSelectProps> = ({
  placeholder = "Выберите уровень",
  isFull = false,
  ...props
}) => {
  return (
    <Select
      {...props}
      options={isFull ? FULL_SKILL_LEVELS : SKILL_LEVELS}
      placeholder={placeholder}
    />
  );
};

export default SkillLevelSelect;
