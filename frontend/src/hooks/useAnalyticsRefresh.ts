import { useEffect, useRef } from 'react';

/**
 * Хук для принудительного обновления аналитических данных при каждом заходе на страницу.
 * Это необходимо, так как аналитические данные постоянно изменяются и не должны кешироваться.
 */
export const useAnalyticsRefresh = (refetchFunctions: Array<() => void>) => {
  const hasRefreshedRef = useRef(false);

  useEffect(() => {
    // Обновляем данные только один раз при монтировании компонента
    if (!hasRefreshedRef.current) {
      refetchFunctions.forEach(refetch => {
        if (typeof refetch === 'function') {
          refetch();
        }
      });
      hasRefreshedRef.current = true;
    }
  }, [refetchFunctions]);

  // Сбрасываем флаг при размонтировании
  useEffect(() => {
    return () => {
      hasRefreshedRef.current = false;
    };
  }, []);
};
