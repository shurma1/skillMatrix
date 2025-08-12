import React from 'react';
import { RedirectIfAuth } from '@/components/RequireAuth';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * HOC для создания публичных маршрутов
 * Перенаправляет авторизованных пользователей
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => (
  <RedirectIfAuth>{children}</RedirectIfAuth>
);

export default PublicRoute;
