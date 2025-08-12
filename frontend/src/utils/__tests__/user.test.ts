import { describe, it, expect } from 'vitest';
import { getUserInitials } from '@/utils/user';

describe('getUserInitials', () => {
  it('uses name parts when available', () => {
    expect(getUserInitials({ firstname: 'Иван', lastname: 'Петров', patronymic: 'Сергеевич', login: 'ipetrov' })).toBe('ПИС');
  });
  it('falls back to login', () => {
    expect(getUserInitials({ login: 'ab', firstname: undefined, lastname: undefined, patronymic: undefined })).toBe('AB');
  });
});
