import React from 'react';
import type { RouteObject } from 'react-router-dom';
import type { RouteMeta } from '../config/route';

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
  titleKey: string,
  descriptionKey: string,
  options: {
    navNameKey?: string;
    showInNav?: boolean;
  } = {}
): RouteMeta => ({
  titleKey: titleKey as any,
  descriptionKey: descriptionKey as any,
  navNameKey: options.navNameKey as any,
  showInNav: options.showInNav ?? false,
});
