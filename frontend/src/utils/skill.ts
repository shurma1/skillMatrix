export const skillProgressRatio = (level: number, target: number): number => {
  if (target <= 0) return 0;
  return Math.min(1, level / target);
};
