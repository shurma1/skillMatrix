import { describe, it, expect } from 'vitest';
import { skillProgressRatio } from '@/utils/skill';

describe('skillProgressRatio', () => {
  it('computes ratio within bounds', () => {
    expect(skillProgressRatio(2,4)).toBe(0.5);
    expect(skillProgressRatio(5,4)).toBe(1);
  });
  it('handles zero target', () => {
    expect(skillProgressRatio(3,0)).toBe(0);
  });
});
