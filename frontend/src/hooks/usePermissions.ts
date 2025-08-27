import { useAppSelector } from '@/hooks/storeHooks';
import type { PermissionDTO } from '@/types/api/permission';

/**
 * Хук для работы с разрешениями пользователя
 */
export const usePermissions = () => {
  const permissions = useAppSelector(state => state.auth.permissions);
  
  /**
   * Проверяет, есть ли у пользователя указанное разрешение
   */
  const hasPermission = (permissionName: string): boolean => {
    return permissions.some(permission => permission.name === permissionName);
  };

  /**
   * Проверяет, есть ли у пользователя любое из указанных разрешений
   */
  const hasAnyPermission = (permissionNames: string[]): boolean => {
    return permissionNames.some(name => hasPermission(name));
  };

  /**
   * Проверяет, есть ли у пользователя все указанные разрешения
   */
  const hasAllPermissions = (permissionNames: string[]): boolean => {
    return permissionNames.every(name => hasPermission(name));
  };

  /**
   * Получает разрешение по имени
   */
  const getPermission = (permissionName: string): PermissionDTO | undefined => {
    return permissions.find(permission => permission.name === permissionName);
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getPermission,
  };
};
