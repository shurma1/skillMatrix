import type {RouteObject} from 'react-router-dom';
import LoginPageAsync from "@/pages/LoginPage/LoginPage.async.ts";
import type {StringKey} from "@/assets/strings.ts";
import ProtectedRoute from '@/components/hoc/ProtectedRoute';
import PublicRoute from '@/components/hoc/PublicRoute';
import HomePageAsync from '@/pages/HomePage/HomePage.async';
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
import TestResultViewPageAsync from "@/pages/TestResultViewPage/TestResultViewPage.async";
import ProfilePageAsync from "@/pages/ProfilePage/ProfilePage.async.ts";
import JobroleSearchPageAsync from "@/pages/JobroleSearchPage/JobroleSearchPage.async.ts";
import JobrolePageAsync from "@/pages/JobrolePage/JobrolePage.async.ts";
import {Permissions} from "@/constants/permissions.ts";
import RequirePermission from '@/components/RequirePermission';
import PermissionDeniedPageAsync from '@/pages/PermissionDeniedPage/PermissionDeniedPage.async';
import AnalyticsPageAsync from "@/pages/AnalyticsPage/AnalyticsPage.async.ts";

export enum AppRoutes {
	Login = 'Login',
	Home = 'Home',
	PermissionDenied = 'PermissionDenied',
	Users = 'Users',
	User = 'User',
	Skills = 'Skills',
	Skill = 'Skill',
	SkillDocument = 'SkillDocument',
	SkillVersions = 'SkillVersions',
	JobRoles = 'JobRoles',
	JobRole = 'JobRole',
	Profile = 'Profile',
	TestCreate = 'TestCreate',
	TestEdit = 'TestEdit',
	TestTake = 'TestTake',
	TestResult = 'TestResult',
	TestResultView = 'TestResultView',
	Analytics = 'Analytics',
}

export interface RouteMeta {
	titleKey: StringKey;
	descriptionKey: StringKey;
	navNameKey?: StringKey;
	showInNav?: boolean;
}

interface RoutePermissions {
	permissionsNeed?: Permissions[];
}

type AppRouteObject = { meta: RouteMeta } & RouteObject & RoutePermissions;


export const RoutePaths: Record<AppRoutes, string> = {
	[AppRoutes.Login]: '/login',
	[AppRoutes.Home]: '/',
	[AppRoutes.PermissionDenied]: '/403',
	[AppRoutes.Profile]: '/profile',
	[AppRoutes.Users]: '/users',
	[AppRoutes.User]: '/users/:userId',
	[AppRoutes.Skills]: '/skills',
	[AppRoutes.Skill]: '/skills/:skillId',
	[AppRoutes.SkillDocument]: '/skills/:skillId/document',
	[AppRoutes.SkillVersions]: '/skills/:skillId/versions',
	[AppRoutes.JobRoles]: '/jobroles',
	[AppRoutes.JobRole]: '/jobroles/:jobroleId',
	[AppRoutes.TestCreate]: '/skills/:skillId/test/create',
	[AppRoutes.TestEdit]: '/skills/:skillId/test/:testId/edit',
	[AppRoutes.TestTake]: '/test/:testId/take',
	[AppRoutes.TestResult]: '/test/:testId/result',
	[AppRoutes.TestResultView]: '/test/:testId/result/view',
	[AppRoutes.Analytics]: '/analytics'
};

export const RouteKeysByPath: Record<string, AppRoutes> = Object.entries(RoutePaths).reduce(
	(acc, [key, path]) => {
		acc[path] = key as AppRoutes;
		return acc;
	},
	{} as Record<string, AppRoutes>
);

export const routeConfig: Record<AppRoutes, AppRouteObject> = {
	[AppRoutes.PermissionDenied]: {
		path: RoutePaths.PermissionDenied,
		element: <PermissionDeniedPageAsync />,
		meta: {
			titleKey: 'HomeTitle',
			descriptionKey: 'HomeDescription',
			showInNav: false,
		},
	},
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
				<HomePageAsync />
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
				<ProfilePageAsync />
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
				<RequirePermission need={[Permissions.VIEW_ALL]}>
					<UsersSearchPageAsync />
				</RequirePermission>
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'UsersTitle',
			descriptionKey: 'UsersDescription',
			navNameKey: 'UsersNavName',
			showInNav: true
		},
		permissionsNeed: [Permissions.VIEW_ALL]
	},
	[AppRoutes.User]: {
		path: RoutePaths.User,
		element: (
			<ProtectedRoute>
				<RequirePermission need={[Permissions.VIEW_ALL]}>
					<UserPageAsync />
				</RequirePermission>
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'UserTitle',
			descriptionKey: 'UserDescription',
			showInNav: false
		},
		permissionsNeed: [Permissions.VIEW_ALL]
	},
	[AppRoutes.Skills]: {
		path: RoutePaths.Skills,
		element: (
			<ProtectedRoute>
				<RequirePermission need={[Permissions.VIEW_ALL]}>
					<SkillsSearchPageAsync />
				</RequirePermission>
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'SkillsTitle',
			descriptionKey: 'SkillsDescription',
			navNameKey: 'SkillsNavName',
			showInNav: true
		},
		permissionsNeed: [Permissions.VIEW_ALL]
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
		},
	},
	[AppRoutes.SkillDocument]: {
		path: RoutePaths.SkillDocument,
		element: (
			<ProtectedRoute>
				<RequirePermission need={[Permissions.VIEW_ALL]}>
					<SkillDocumentPageAsync />
				</RequirePermission>
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'SkillTitle',
			descriptionKey: 'SkillDescription',
			showInNav: false
		},
		permissionsNeed: [Permissions.VIEW_ALL]
	},
	[AppRoutes.SkillVersions]: {
		path: RoutePaths.SkillVersions,
		element: (
			<ProtectedRoute>
				<RequirePermission need={[Permissions.VIEW_ALL]}>
					<SkillVersionsPage />
				</RequirePermission>
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'SkillVersionsTitle',
			descriptionKey: 'SkillVersionsDescription',
			showInNav: false
		},
		permissionsNeed: [Permissions.VIEW_ALL]
	},
	[AppRoutes.JobRoles]: {
		path: RoutePaths.JobRoles,
		element: (
			<ProtectedRoute>
				<RequirePermission need={[Permissions.VIEW_ALL]}>
					<JobroleSearchPageAsync />
				</RequirePermission>
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'JobRolesTitle',
			descriptionKey: 'JobRolesDescription',
			navNameKey: 'JobroleNavName',
			showInNav: true
		},
		permissionsNeed: [Permissions.VIEW_ALL]
	},
	[AppRoutes.JobRole]: {
		path: RoutePaths.JobRole,
		element: (
			<ProtectedRoute>
				<RequirePermission need={[Permissions.VIEW_ALL]}>
					<JobrolePageAsync />
				</RequirePermission>
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'JobRolesTitle',
			descriptionKey: 'JobRolesDescription',
			navNameKey: 'JobroleNavName',
			showInNav: false
		},
		permissionsNeed: [Permissions.VIEW_ALL]
	},
	[AppRoutes.TestCreate]: {
		path: RoutePaths.TestCreate,
		element: (
			<ProtectedRoute>
				<RequirePermission need={[Permissions.EDIT_ALL]}>
					<TestCreatePageAsync />
				</RequirePermission>
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'TestCreateTitle',
			descriptionKey: 'TestCreateDescription',
			showInNav: false
		},
		permissionsNeed: [Permissions.EDIT_ALL]
	},
	[AppRoutes.TestEdit]: {
		path: RoutePaths.TestEdit,
		element: (
			<ProtectedRoute>
				<RequirePermission need={[Permissions.EDIT_ALL]}>
					<TestEditPageAsync />
				</RequirePermission>
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'TestEditTitle',
			descriptionKey: 'TestEditDescription',
			showInNav: false
		},
		permissionsNeed: [Permissions.EDIT_ALL]
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
	[AppRoutes.TestResultView]: {
		path: RoutePaths.TestResultView,
		element: (
			<ProtectedRoute>
				<TestResultViewPageAsync />
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'TestResultViewTitle',
			descriptionKey: 'TestResultViewDescription',
			showInNav: false
		}
	},
	[AppRoutes.Analytics]: {
		path: RoutePaths.Analytics,
		element: (
			<ProtectedRoute>
				<AnalyticsPageAsync />
			</ProtectedRoute>
		),
		meta: {
			titleKey: 'TestResultViewTitle',
			descriptionKey: 'TestResultViewDescription',
			navNameKey: 'AnalyticsNavName',
			showInNav: true
		}
	},
};
