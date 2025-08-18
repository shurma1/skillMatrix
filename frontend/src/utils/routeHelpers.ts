import React from 'react';
import type { RouteObject } from 'react-router-dom';
import type { RouteMeta } from '../config/route';
import type { StringKey } from '@/assets/strings';

type AppRouteObject = { meta: RouteMeta } & RouteObject;

/**
 * Создает защищенный маршрут
 */
export const createProtectedRoute = (
  path: string,
  element: React.ReactElement,
  meta: RouteMeta
): AppRouteObject => ({
  path,
  element,
  meta,
});

/**
 * Создает публичный маршрут
 */
export const createPublicRoute = (
  path: string,
  element: React.ReactElement,
  meta: RouteMeta
): AppRouteObject => ({
  path,
  element,
  meta,
});

/**
 * Создает мета-данные для маршрута
 */
export const createRouteMeta = (
  titleKey: StringKey,
  descriptionKey: StringKey,
  options: {
    navNameKey?: StringKey;
    showInNav?: boolean;
  } = {}
): RouteMeta => ({
  titleKey,
  descriptionKey,
  navNameKey: options.navNameKey,
  showInNav: options.showInNav ?? false,
});
