import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { useRefreshMutation } from '@/store/endpoints';
import { setTokens } from '@/store/authSlice';

// Декодирование JWT без проверки подписи (только для чтения exp)
function decodeJwt(token?: string | null): { exp?: number } | null {
  if (!token) return null;
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Хук для инициализации аутентификации при загрузке приложения
 * Пытается обновить токены если пользователь был авторизован
 */
export const useAuthInit = () => {
  const dispatch = useAppDispatch();
  const { refreshToken, accessToken, user } = useAppSelector(state => state.auth);
  const [refreshTokens] = useRefreshMutation();
  const initAttempted = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      // Если уже пытались инициализировать или нет сохраненных данных
      if (initAttempted.current || !user) {
        return;
      }

      initAttempted.current = true;

      try {
        // Декодируем текущий accessToken
        const decoded = decodeJwt(accessToken);
        const now = Math.floor(Date.now() / 1000);
        const exp = decoded?.exp;

        // Если нет refreshToken в состоянии — не делаем ничего (ждём первую 401 стратегию)
        if (!refreshToken) {
          return;
        }

        // Обновляем только если токен отсутствует или истекает в ближайшие 30 секунд
        if (!accessToken || !exp || exp - now < 30) {
          const tokens = await refreshTokens().unwrap();
          dispatch(setTokens(tokens));
          console.log('Auth tokens refreshed (init)');
        }
      } catch (error) {
        // Не делаем немедленный logout чтобы избежать выкидывания при временных сетевых проблемах
        console.warn('Auth initialization refresh failed:', error);
      }
    };

    initAuth();
  }, [user, refreshToken, accessToken, refreshTokens, dispatch]);

  return {
  isInitializing: !initAttempted.current && !!user
  };
};
