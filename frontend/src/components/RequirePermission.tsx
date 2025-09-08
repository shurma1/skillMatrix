import type { FC, PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/storeHooks';
import { RoutePaths } from '@/config/route';
import type { Permissions } from '@/constants/permissions';

interface RequirePermissionProps {
  need?: Permissions[];
}

const RequirePermission: FC<PropsWithChildren<RequirePermissionProps>> = ({ children, need }) => {
  const location = useLocation();
  const userPermissions = useAppSelector((s) => s.auth.permissions);

  if (!need || need.length === 0) return <>{children}</>;

  const names = new Set(userPermissions.map((p) => p.name));
  const ok = need.every((perm) => names.has(perm));
  if (!ok) return <Navigate to={RoutePaths.PermissionDenied} state={{ from: location }} replace />;
  return <>{children}</>;
};

export default RequirePermission;
