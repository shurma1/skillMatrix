import type { FC, ReactNode } from 'react';
import { useEffect } from 'react';
import Loader from '@/components/Loader';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { useGetMyPermissionsQuery } from '@/store/endpoints';
import { setPermissions } from '@/store/authSlice';
import { useSmoothedLoading } from '@/hooks/useSmoothedLoading';

interface PermissionsGateProps {
  app: ReactNode;
}

const PermissionsGate: FC<PermissionsGateProps> = ({ app }) => {
  const dispatch = useAppDispatch();
  const { accessToken, permissions: storedPermissions } = useAppSelector((s) => s.auth);

  const {
    data,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetMyPermissionsQuery(undefined, { skip: !accessToken });

  const smoothedLoading = useSmoothedLoading(
    (isLoading || isFetching) && !!accessToken,
    !!data
  );

  useEffect(() => {
    if (!accessToken && storedPermissions.length) {
      dispatch(setPermissions([]));
    }
  }, [accessToken, dispatch]); // убрал storedPermissions.length из зависимостей чтобы избежать цикла
  
  useEffect(() => {
    if (isSuccess && data) {
      // Сравнение по длине и id (предполагаем стабильный порядок)
      const same = data.length === storedPermissions.length && data.every((p, i) => p.id === storedPermissions[i]?.id);
      if (!same) {
        dispatch(setPermissions(data));
      }
    } else if (isError && storedPermissions.length) {
      dispatch(setPermissions([]));
    }
  }, [isSuccess, isError, data, dispatch]); // убрал storedPermissions из зависимостей
  // Повторяем запрос только если он был прерван (Abort) во время refresh цикла
  useEffect(() => {
    const status = (error as any)?.status;
    if (status === 'ABORTED') {
      refetch();
    }
  }, [error, refetch]);

  const showLoader = smoothedLoading;

  if (showLoader) {
    return <Loader />;
  }

  return <>{app}</>;
};

export default PermissionsGate;
