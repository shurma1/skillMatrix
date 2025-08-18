/**
 * Утилиты для работы с датами
 */

/**
 * Форматирует дату в удобочитаемый формат
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Проверяем, что дата валидна
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return dateString;
  }
};

/**
 * Форматирует дату и время
 */
export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Проверяем, что дата валидна
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

/**
 * Проверяет, просрочена ли дата
 */
export const isDateOverdue = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    // Проверяем, что дата валидна
    if (isNaN(date.getTime())) {
      return false;
    }
    const now = new Date();
    return date < now;
  } catch {
    return false;
  }
};

/**
 * Получает относительное время (например, "2 дня назад")
 */
export const getRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Проверяем, что дата валидна
    if (isNaN(date.getTime())) {
      return dateString;
    }
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Сегодня';
    if (diffInDays === 1) return 'Вчера';
    if (diffInDays < 30) return `${diffInDays} дн. назад`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} мес. назад`;
    return `${Math.floor(diffInDays / 365)} г. назад`;
  } catch {
    return dateString;
  }
};
