import { NextFunction, Request, Response } from 'express';
import TokenService from '../services/token.service';
import { ApiError } from '../error/apiError';
import { Permission, User } from '../models';
import { PermissionInstance } from '../models/entities/Permission';
import { UserInstance } from '../models/entities/User';
import { PermissionKeys } from '../constants/permissons';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			authUser?: UserInstance | null;
			userPermissions?: string[];
		}
	}
}

export type PermissionMiddlewareOptions = {
	needAuth?: boolean;
	permission?: PermissionKeys[];
	allowSelfAccess?: boolean;
};

function getTargetUserId(req: Request): string | null {
	const candidate =
		(req.params?.id as string) ||
		(req.params?.userId as string) ||
		(req.body?.userId as string) ||
		(req.query?.userId as string);
	return typeof candidate === 'string' && candidate.length > 0 ? candidate : null;
}

async function resolveUserAndPermissions(userId: string): Promise<{ user: UserInstance | null; permissions: string[] }> {
	const user = (await User.findOne({
		where: { id: userId },
		include: [
			{
				model: Permission,
				through: { attributes: [] },
			},
		],
	})) as (UserInstance & { permissions: PermissionInstance[] }) | null;
	if (!user) {
		throw ApiError.errorByType('USER_NOT_FOUND');
	}
	const permissions = user.permissions
		? (user.permissions as PermissionInstance[]).map((p) => p.name)
		: [];
	return { user, permissions };
}

export default function permissionMiddleware(options: PermissionMiddlewareOptions = {}) {
	const { needAuth = false, permission, allowSelfAccess = false } = options;
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			const permissionsRequired: PermissionKeys[] = permission ?? [];
			const mustBeAuthed = needAuth || permissionsRequired.length > 0 || allowSelfAccess;
			let user: UserInstance | null = null;
			let userPermissions: string[] = [];
			if (mustBeAuthed) {
				const { authorization } = req.headers;
				if (!authorization || !authorization.includes('Bearer ')) {
					throw ApiError.errorByType('INVALID_ACCESS_TOKEN');
				}
				const token = (authorization as string).split(' ')[1];
				const payload = TokenService.ValidateAccessToken(token);
				const resolved = await resolveUserAndPermissions(payload.userId);
				user = resolved.user;
				userPermissions = resolved.permissions;
				req.authUser = user;
				req.userPermissions = userPermissions;
			}
			if (allowSelfAccess && user) {
				const targetUserId = getTargetUserId(req);
				if (targetUserId && targetUserId === user.id) {
					return next();
				}
			}
			if (permissionsRequired.length > 0) {
				if (userPermissions.includes('ADMIN')) {
					return next();
				}
				const hasAny = permissionsRequired.some((perm) => userPermissions.includes(perm));
				if (!hasAny) {
					throw ApiError.errorByType('PERMISSION_DENIED');
				}
			}
			return next();
		} catch (err) {
			return next(err);
		}
	};
}

export function getAuthUser(req: Request): UserInstance | null {
	return req.authUser || null;
}

export function getUserPermissions(req: Request): string[] {
	return req.userPermissions || [];
}




