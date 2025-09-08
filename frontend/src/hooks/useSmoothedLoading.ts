import { useRef, useEffect } from 'react';
import { useAppSelector } from '@/hooks/storeHooks';

/**
 * Хук для сглаженного отображения состояния загрузки
 * Предотвращает мигание лоадеров при refresh токенов
 */
export const useSmoothedLoading = (isLoading: boolean, hasData?: boolean) => {
  const isRefreshingTokens = useAppSelector(state => state.app.isRefreshingTokens);
  const hasLoadedOnceRef = useRef(false);
  
  // Отмечаем, что данные загружались хотя бы раз
  useEffect(() => {
    if (!isLoading && hasData !== undefined ? hasData : true) {
      hasLoadedOnceRef.current = true;
    }
  }, [isLoading, hasData]);
  
  // Если токены обновляются и данные уже загружались ранее,
  // не показываем лоадер, чтобы избежать мигания
  if (isRefreshingTokens && hasLoadedOnceRef.current) {
    return false;
  }
  
  return isLoading;
};
