import type { ConfirmationDTO } from '@/types/api/user';

/**
 * Утилитарные функции для работы с подтверждениями навыков
 */

export type ConfirmationType = 'acquired' | 'debuff' | 'admin_set';

/**
 * Получить текстовое описание типа подтверждения
 * @param type - тип подтверждения
 * @param previousLevel - предыдущий уровень (для admin_set)
 * @param currentLevel - текущий уровень (для admin_set)
 */
export const getConfirmationTypeText = (
  type: ConfirmationType, 
  previousLevel?: number, 
  currentLevel?: number
): string => {
  switch (type) {
    case 'acquired':
      return 'Повышен';
    case 'debuff':
      return 'Снижен';
    case 'admin_set':
      // Определяем направление изменения для admin_set
      if (previousLevel !== undefined && currentLevel !== undefined) {
        return currentLevel > previousLevel ? 'Повышен' : 'Снижен';
      }
      // Если нет информации о предыдущем уровне, возвращаем нейтральное описание
      return 'Изменен';
    default:
      return type;
  }
};

/**
 * Получить цвет для типа подтверждения
 * @param type - тип подтверждения
 * @param previousLevel - предыдущий уровень (для admin_set)
 * @param currentLevel - текущий уровень (для admin_set)
 */
export const getConfirmationTypeColor = (
  type: ConfirmationType, 
  previousLevel?: number, 
  currentLevel?: number
): string => {
  switch (type) {
    case 'acquired':
      return 'green';
    case 'debuff':
      return 'red';
    case 'admin_set':
      // Определяем цвет на основе направления изменения для admin_set
      if (previousLevel !== undefined && currentLevel !== undefined) {
        return currentLevel > previousLevel ? 'green' : 'red';
      }
      // Если нет информации о направлении, используем оранжевый
      return 'orange';
    default:
      return 'default';
  }
};

/**
 * Проверить, есть ли подтверждения установленные администратором
 */
export const hasAdminSetConfirmations = (confirmations: ConfirmationDTO[]): boolean => {
  return confirmations.some(conf => conf.type === 'admin_set');
};

/**
 * Получить последнее подтверждение
 */
export const getLastConfirmation = (confirmations: ConfirmationDTO[]): ConfirmationDTO | null => {
  if (!confirmations || confirmations.length === 0) {
    return null;
  }

  return confirmations
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
};

/**
 * Получить последнее подтверждение определенного типа
 */
export const getLastConfirmationByType = (
  confirmations: ConfirmationDTO[],
  types: ConfirmationType[]
): ConfirmationDTO | null => {
  if (!confirmations || confirmations.length === 0) {
    return null;
  }

  return confirmations
    .filter(conf => types.includes(conf.type as ConfirmationType))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] || null;
};

/**
 * Проверить, установлен ли текущий уровень администратором
 */
export const isCurrentLevelAdminSet = (confirmations: ConfirmationDTO[]): boolean => {
  const lastConfirmation = getLastConfirmation(confirmations);
  return lastConfirmation?.type === 'admin_set';
};

/**
 * Получить все подтверждения, повышающие уровень (acquired и admin_set)
 */
export const getPositiveConfirmations = (confirmations: ConfirmationDTO[]): ConfirmationDTO[] => {
  return confirmations.filter(conf => 
    conf.type === 'acquired' || conf.type === 'admin_set'
  );
};

/**
 * Форматировать дату подтверждения
 */
export const formatConfirmationDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('ru-RU');
  } catch {
    return dateString;
  }
};

/**
 * Получить предыдущий уровень для конкретного подтверждения
 */
export const getPreviousLevel = (
  confirmations: ConfirmationDTO[], 
  targetConfirmation: ConfirmationDTO
): number | undefined => {
  // Создаем копию массива и сортируем подтверждения по дате
  const sortedConfirmations = [...confirmations]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Находим индекс целевого подтверждения
  const targetIndex = sortedConfirmations.findIndex(conf => 
    conf.id === targetConfirmation.id
  );
  
  if (targetIndex <= 0) {
    // Если это первое подтверждение или не найдено, возвращаем 0
    return 0;
  }
  
  // Возвращаем уровень предыдущего подтверждения
  return sortedConfirmations[targetIndex - 1].level;
};
