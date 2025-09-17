import { useEffect, useRef } from 'react';
import { useAppSelector } from '@/hooks/storeHooks';

/**
 * useStableSkeleton
 * Цель: при initial loading показываем skeleton. После первой успешной загрузки
 * при token refresh НЕ показываем промежуточные спиннеры или пропадание контента.
 * Вместо этого оставляем уже отрисованные данные (или skeleton, если данных ещё нет).
 * Возвращает объект с флагами:
 *  showSkeleton: показывать ли skeleton вместо контента
 *  hideContent: скрыть ли контент (true до первой успешной загрузки)
 */
export const useStableSkeleton = (isFetching: boolean, hasData: boolean) => {
  const isRefreshing = useAppSelector(s => s.app.isRefreshingTokens);
  const loadedOnceRef = useRef(false);

  useEffect(() => {
    if (!isFetching && hasData) loadedOnceRef.current = true;
  }, [isFetching, hasData]);

  // До первой успешной загрузки показываем skeleton ТОЛЬКО пока реально идёт fetch.
  // Если fetch завершился (isFetching=false), но данных нет (hasData=false) — прекращаем skeleton (ресурс опционален/пустой).
  if (!loadedOnceRef.current) {
    if (isFetching) {
      return { showSkeleton: true, hideContent: true } as const;
    }
    // fetch остановился, данных нет — считаем завершённым, разрешаем контент/placeholder
    loadedOnceRef.current = true;
  }

  // После первой загрузки, если идёт refresh и запрос снова в isFetching -> подавляем skeleton чтобы не мигал
  if (loadedOnceRef.current && isRefreshing && isFetching) {
    return { showSkeleton: false, hideContent: false } as const;
  }

  // Обычный случай: показываем skeleton только когда реально первая загрузка
  return { showSkeleton: false, hideContent: false } as const;
};

export default useStableSkeleton;