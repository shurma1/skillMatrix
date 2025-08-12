import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/storeHooks.ts';
import { RoutePaths } from '@/config/route.tsx';

// Consolidated auth guards exported as named + default for backwards compatibility.
export const RequireAuth: React.FC<React.PropsWithChildren> = ({ children }) => {
  const user = useAppSelector(s => s.auth.user);
  const location = useLocation();
  if (!user) return <Navigate to={RoutePaths.Login} state={{ from: location }} replace />;
  return <>{children}</>;
};

export const RedirectIfAuth: React.FC<React.PropsWithChildren> = ({ children }) => {
  const user = useAppSelector(s => s.auth.user);
  const location = useLocation();
  if (user) return <Navigate to={RoutePaths.Home} state={{ from: location }} replace />;
  return <>{children}</>;
};

export default RequireAuth;
