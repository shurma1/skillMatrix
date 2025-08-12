import React from 'react';
import type { RouteObject } from 'react-router-dom';
import LoginPageAsync from "../pages/LoginPage/LoginPage.async";
import type { RouteMeta } from './route';
import { RouteMetaFactory } from '../factories/RouteMetaFactory';
import ProtectedRoute from '@/components/hoc/ProtectedRoute';
import PublicRoute from '@/components/hoc/PublicRoute';
import HomePage from '@/components/pages/HomePage';
import ProfilePage from '@/components/pages/ProfilePage';
import UsersSearchPage from '@/components/pages/UsersSearchPage';
import UserPage from '@/components/pages/UserPage';
import SkillsSearchPage from '@/components/pages/SkillsSearchPage';
import SkillPage from '@/components/pages/SkillPage';
import JobRolesPage from '@/components/pages/JobRolesPage';

type AppRouteObject = { meta: RouteMeta } & RouteObject;

/**
 * Создает защищенный маршрут
 */
const createProtectedRoute = (
  path: string,
  Component: React.ComponentType,
  meta: RouteMeta
): AppRouteObject => ({
  path,
  element: (
    <ProtectedRoute>
      <Component />
    </ProtectedRoute>
  ),
  meta,
});

/**
 * Создает публичный маршрут
 */
const createPublicRoute = (
  path: string,
  Component: React.ComponentType,
  meta: RouteMeta
): AppRouteObject => ({
  path,
  element: (
    <PublicRoute>
      <Component />
    </PublicRoute>
  ),
  meta,
});

/**
 * Конфигурация маршрутов с использованием принципов чистого кода
 */
export const createRouteConfig = () => ({
  login: createPublicRoute(
    '/login',
    LoginPageAsync,
    RouteMetaFactory.createPublic('LoginTitle', 'LoginDescription')
  ),
  
  home: createProtectedRoute(
    '/',
    HomePage,
    RouteMetaFactory.createNavigation('HomeTitle', 'HomeDescription', 'HomeNavName')
  ),
  
  profile: createProtectedRoute(
    '/profile',
    ProfilePage,
    RouteMetaFactory.createProtected('ProfileTitle', 'ProfileDescription')
  ),
  
  users: createProtectedRoute(
    '/users',
    UsersSearchPage,
    RouteMetaFactory.createNavigation('UsersTitle', 'UsersDescription', 'UsersNavName')
  ),
  
  user: createProtectedRoute(
    '/users/:userId',
    UserPage,
    RouteMetaFactory.createProtected('UserTitle', 'UserDescription')
  ),
  
  skills: createProtectedRoute(
    '/skills',
    SkillsSearchPage,
    RouteMetaFactory.createNavigation('SkillsTitle', 'SkillsDescription', 'SkillsNavName')
  ),
  
  skill: createProtectedRoute(
    '/skills/:skillId',
    SkillPage,
    RouteMetaFactory.createProtected('SkillTitle', 'SkillDescription')
  ),
  
  jobRoles: createProtectedRoute(
    '/jobroles',
    JobRolesPage,
    RouteMetaFactory.createNavigation('JobRolesTitle', 'JobRolesDescription', 'JobroleNavName')
  ),
});
