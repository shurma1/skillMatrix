import React from 'react';
import { RequireAuth } from '@/components/RequireAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * HOC для создания защищенных маршрутов
 * Оборачивает компонент в RequireAuth
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => (
  <RequireAuth>{children}</RequireAuth>
);

export default ProtectedRoute;
