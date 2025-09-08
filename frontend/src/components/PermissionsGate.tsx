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
  const { accessToken } = useAppSelector((s) => s.auth);

  const {
    data,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch,
  } = useGetMyPermissionsQuery(undefined, {
    skip: !accessToken,
  });

  const smoothedLoading = useSmoothedLoading(
    (isLoading || isFetching) && !!accessToken,
    !!data
  );

  useEffect(() => {
    if (!accessToken) {
      dispatch(setPermissions([]));
    }
  }, [accessToken, dispatch]);
  
  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setPermissions(data));
    } else if (isError) {
      dispatch(setPermissions([]));
    }
  }, [isSuccess, isError, data, dispatch]);
  
  useEffect(() => {
    if (accessToken) {
      refetch();
    }
  }, [accessToken, refetch]);

  const showLoader = smoothedLoading;

  if (showLoader) {
    return <Loader />;
  }

  return <>{app}</>;
};

export default PermissionsGate;
