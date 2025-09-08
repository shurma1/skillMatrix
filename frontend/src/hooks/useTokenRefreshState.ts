import { useAppSelector } from '@/hooks/storeHooks';

/**
 * Хук для отслеживания глобального состояния refresh токенов
 * Полезен для компонентов, которые хотят знать о процессе обновления токенов
 */
export const useTokenRefreshState = () => {
  const isRefreshingTokens = useAppSelector(state => state.app.isRefreshingTokens);
  
  return {
    isRefreshingTokens,
  };
};
