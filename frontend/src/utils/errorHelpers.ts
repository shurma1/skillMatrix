/**
 * Утилиты для обработки ошибок
 */

/**
 * Извлекает сообщение об ошибке из различных типов ошибок
 */
export const extractErrMessage = (error: unknown): string | null => {
  if (!error) return null;
  
  // RTK Query error
  if (typeof error === 'object' && 'data' in error) {
    const rtqError = error as { data?: { message?: string } };
    if (rtqError.data?.message) {
      return rtqError.data.message;
    }
  }
  
  // Standard Error object
  if (error instanceof Error) {
    return error.message;
  }
  
  // String error
  if (typeof error === 'string') {
    return error;
  }
  
  // Object with message property
  if (typeof error === 'object' && 'message' in error) {
    const objError = error as { message?: string };
    return objError.message || null;
  }
  
  return null;
};

/**
 * Обрабатывает ошибку и возвращает пользователю понятное сообщение
 */
export const handleApiError = (error: unknown, defaultMessage = 'Произошла ошибка'): string => {
  const message = extractErrMessage(error);
  return message || defaultMessage;
};

/**
 * Типы ошибок для более точной обработки
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Определяет тип ошибки на основе кода состояния
 */
export const getErrorType = (status?: number): ErrorType => {
  if (!status) return ErrorType.UNKNOWN;
  
  if (status >= 400 && status < 500) {
    if (status === 401) return ErrorType.AUTHORIZATION;
    if (status === 404) return ErrorType.NOT_FOUND;
    if (status >= 400 && status < 500) return ErrorType.VALIDATION;
  }
  
  if (status >= 500) return ErrorType.SERVER;
  
  return ErrorType.UNKNOWN;
};
