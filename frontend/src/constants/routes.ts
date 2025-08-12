/**
 * Константы для маршрутов приложения
 * Используются для типизации и предотвращения опечаток
 */

export const APP_ROUTES = {
  LOGIN: 'Login',
  HOME: 'Home',
  USERS: 'Users',
  USER: 'User',
  SKILLS: 'Skills',
  SKILL: 'Skill',
  JOB_ROLES: 'JobRoles',
  PROFILE: 'Profile',
} as const;

export const ROUTE_PATHS = {
  [APP_ROUTES.LOGIN]: '/login',
  [APP_ROUTES.HOME]: '/',
  [APP_ROUTES.PROFILE]: '/profile',
  [APP_ROUTES.USERS]: '/users',
  [APP_ROUTES.USER]: '/users/:userId',
  [APP_ROUTES.SKILLS]: '/skills',
  [APP_ROUTES.SKILL]: '/skills/:skillId',
  [APP_ROUTES.JOB_ROLES]: '/jobroles',
} as const;

/**
 * Мета-данные для навигации
 */
export const NAVIGATION_ROUTES = [
  {
    key: APP_ROUTES.HOME,
    titleKey: 'HomeTitle',
    navKey: 'HomeNavName',
  },
  {
    key: APP_ROUTES.USERS,
    titleKey: 'UsersTitle',
    navKey: 'UsersNavName',
  },
  {
    key: APP_ROUTES.SKILLS,
    titleKey: 'SkillsTitle',
    navKey: 'SkillsNavName',
  },
  {
    key: APP_ROUTES.JOB_ROLES,
    titleKey: 'JobRolesTitle',
    navKey: 'JobroleNavName',
  },
] as const;

export type AppRouteKey = typeof APP_ROUTES[keyof typeof APP_ROUTES];
