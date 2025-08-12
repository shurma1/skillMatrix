import type { RouteObject } from 'react-router-dom';
import LoginPageAsync from "@/pages/LoginPage/LoginPage.async.ts";
import type {StringKey} from "@/assets/strings.ts";
import ProtectedRoute from '@/components/hoc/ProtectedRoute';
import PublicRoute from '@/components/hoc/PublicRoute';
import HomePage from '@/components/pages/HomePage';
import ProfilePage from '@/components/pages/ProfilePage';
import JobRolesPage from '@/components/pages/JobRolesPage';
import SkillVersionsPage from '@/components/pages/SkillVersionsPage';
import SkillPageAsync from "@/pages/SkillPage/SkillPage.async.ts";
import UsersSearchPageAsync from "@/pages/UsersSearchPage/UsersSearchPage.async.ts";
import UserPageAsync from "@/pages/UserPage/UserPage.async.ts";
import SkillsSearchPageAsync from "@/pages/SkillsSearchPage/SkillsSearchPage.async.ts";
import SkillDocumentPageAsync from "@/pages/SkillDocumentPage/SkillDocumentPage.async.ts";
import TestCreatePageAsync from "@/pages/TestCreatePage/TestCreatePage.async.ts";
import TestEditPageAsync from "@/pages/TestEditPage/TestEditPage.async.ts";
import TestTakePageAsync from "@/pages/TestTakePage/TestTakePage.async.ts";
import TestResultPageAsync from "@/pages/TestResultPage/TestResultPage.async";

export enum AppRoutes {
	Login = 'Login',
	Home = 'Home',
	Users = 'Users',
	User = 'User',
	Skills = 'Skills',
	Skill = 'Skill',
	SkillDocument = 'SkillDocument',
	SkillVersions = 'SkillVersions',
	JobRoles = 'JobRoles',
	Profile = 'Profile',
	TestCreate = 'TestCreate',
	TestEdit = 'TestEdit',
	TestTake = 'TestTake',
	TestResult = 'TestResult',
}

export interface RouteMeta {
	titleKey: StringKey;
	descriptionKey: StringKey;
	navNameKey?: StringKey;
	showInNav?: boolean;
}

type AppRouteObject = { meta: RouteMeta } & RouteObject;


export const RoutePaths: Record<AppRoutes, string> = {
	[AppRoutes.Login]: '/login',
	[AppRoutes.Home]: '/',
	[AppRoutes.Profile]: '/profile',
	[AppRoutes.Users]: '/users',
	[AppRoutes.User]: '/users/:userId',
	[AppRoutes.Skills]: '/skills',
	[AppRoutes.Skill]: '/skills/:skillId',
	[AppRoutes.SkillDocument]: '/skills/:skillId/document',
	[AppRoutes.SkillVersions]: '/skills/:skillId/versions',
	[AppRoutes.JobRoles]: '/jobroles',
	[AppRoutes.TestCreate]: '/skills/:skillId/test/create',
	[AppRoutes.TestEdit]: '/skills/:skillId/test/:testId/edit',
	[AppRoutes.TestTake]: '/test/:testId/take',
	[AppRoutes.TestResult]: '/test/:testId/result',
};

export const RouteKeysByPath: Record<string, AppRoutes> = Object.entries(RoutePaths).reduce(
	(acc, [key, path]) => {
		acc[path] = key as AppRoutes;
		return acc;
	},
	{} as Record<string, AppRoutes>
);

export const routeConfig: Record<AppRoutes, AppRouteObject> = {
	[AppRoutes.Login]: {
		path: RoutePaths.Login,
		element: (
			<PublicRoute>
				<LoginPageAsync />
			</PublicRoute>
		),
		meta: {
			titleKey: 'LoginTitle',
			descriptionKey: 'LoginDescription',
			showInNav: false
		}
	},
	[AppRoutes.Home]: {
		path: RoutePaths.Home,
		element: (
			<ProtectedRoute>
				<HomePage />
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'HomeTitle',
			descriptionKey: 'HomeDescription',
			navNameKey: 'HomeNavName',
			showInNav: true
		}
	},
	[AppRoutes.Profile]: {
		path: RoutePaths.Profile,
		element: (
			<ProtectedRoute>
				<ProfilePage />
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'ProfileTitle',
			descriptionKey: 'ProfileDescription',
			showInNav: false
		}
	},
	[AppRoutes.Users]: {
		path: RoutePaths.Users,
		element: (
			<ProtectedRoute>
				<UsersSearchPageAsync />
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'UsersTitle',
			descriptionKey: 'UsersDescription',
			navNameKey: 'UsersNavName',
			showInNav: true
		}
	},
	[AppRoutes.User]: {
		path: RoutePaths.User,
		element: (
			<ProtectedRoute>
				<UserPageAsync />
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'UserTitle',
			descriptionKey: 'UserDescription',
			showInNav: false
		}
	},
	[AppRoutes.Skills]: {
		path: RoutePaths.Skills,
		element: (
			<ProtectedRoute>
				<SkillsSearchPageAsync />
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'SkillsTitle',
			descriptionKey: 'SkillsDescription',
			navNameKey: 'SkillsNavName',
			showInNav: true
		}
	},
	[AppRoutes.Skill]: {
		path: RoutePaths.Skill,
		element: (
			<ProtectedRoute>
				<SkillPageAsync />
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'SkillTitle',
			descriptionKey: 'SkillDescription',
			showInNav: false
		}
	},
	[AppRoutes.SkillDocument]: {
		path: RoutePaths.SkillDocument,
		element: (
			<ProtectedRoute>
				<SkillDocumentPageAsync />
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'SkillTitle',
			descriptionKey: 'SkillDescription',
			showInNav: false
		}
	},
	[AppRoutes.SkillVersions]: {
		path: RoutePaths.SkillVersions,
		element: (
			<ProtectedRoute>
				<SkillVersionsPage />
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'SkillVersionsTitle',
			descriptionKey: 'SkillVersionsDescription',
			showInNav: false
		}
	},
	[AppRoutes.JobRoles]: {
		path: RoutePaths.JobRoles,
		element: (
			<ProtectedRoute>
				<JobRolesPage />
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'JobRolesTitle',
			descriptionKey: 'JobRolesDescription',
			navNameKey: 'JobroleNavName',
			showInNav: true
		}
	},
	[AppRoutes.TestCreate]: {
		path: RoutePaths.TestCreate,
		element: (
			<ProtectedRoute>
				<TestCreatePageAsync />
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'TestCreateTitle',
			descriptionKey: 'TestCreateDescription',
			showInNav: false
		}
	},
	[AppRoutes.TestEdit]: {
		path: RoutePaths.TestEdit,
		element: (
			<ProtectedRoute>
				<TestEditPageAsync />
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'TestEditTitle',
			descriptionKey: 'TestEditDescription',
			showInNav: false
		}
	},
	[AppRoutes.TestTake]: {
		path: RoutePaths.TestTake,
		element: (
			<ProtectedRoute>
				<TestTakePageAsync />
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'TestTakeTitle',
			descriptionKey: 'TestTakeDescription',
			showInNav: false
		}
	},
	[AppRoutes.TestResult]: {
		path: RoutePaths.TestResult,
		element: (
			<ProtectedRoute>
				<TestResultPageAsync />
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'TestResultTitle',
			descriptionKey: 'TestResultDescription',
			showInNav: false
		}
	},
};
