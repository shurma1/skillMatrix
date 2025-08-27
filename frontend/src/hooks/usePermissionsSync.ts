import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { useGetMyPermissionsQuery } from '@/store/endpoints';
import { setPermissions } from '@/store/authSlice';

/**
 * Хук для загрузки и синхронизации разрешений пользователя
 */
export const usePermissionsSync = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector(state => state.auth);
  
  const { 
    data: permissions, 
    isSuccess,
    isError,
    error 
  } = useGetMyPermissionsQuery(undefined, {
    skip: !accessToken, // Не загружать, если нет токена
  });

  // Обновляем разрешения в store при успешной загрузке
  useEffect(() => {
    if (isSuccess && permissions) {
      dispatch(setPermissions(permissions));
    }
  }, [isSuccess, permissions, dispatch]);

  // Сбрасываем разрешения при ошибке
  useEffect(() => {
    if (isError) {
      dispatch(setPermissions([]));
    }
  }, [isError, dispatch]);

  return { 
    permissions, 
    isLoading: !isSuccess && !!accessToken,
    isError,
    error 
  };
};
