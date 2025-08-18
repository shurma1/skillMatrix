import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { useGetProfileQuery } from '@/store/endpoints';
import { setUser } from '@/store/authSlice';

/**
 * Хук для загрузки и синхронизации данных профиля пользователя
 */
export const useProfileSync = () => {
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector(state => state.auth);
  
  const { data: profile, isSuccess } = useGetProfileQuery(undefined, {
    skip: !accessToken, // Не загружать, если нет токена
  });

  // Обновляем данные пользователя в store при успешной загрузке
  useEffect(() => {
    if (isSuccess && profile) {
      dispatch(setUser(profile));
    }
  }, [isSuccess, profile, dispatch]);

  return { profile, isLoading: !isSuccess && !!accessToken };
};
