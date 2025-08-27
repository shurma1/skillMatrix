import express from 'express';
import UserController from '../controllers/user.controller';
import permissionMiddleware from "../middlewares/permission.middleware";
import JobRoleController from "../controllers/jobRole.controller";
import PermissionController from "../controllers/permission.controller";

const router = express.Router();

/**
 * @openapi
 * /api/me/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags:
 *       - Me
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 */
router.get(
	'/profile',
	permissionMiddleware({
		needAuth: true,
	}),
	UserController.getMe
);

/**
 * @openapi
 * /api/me/permissions:
 *   get:
 *     summary: Get current user's permissions
 *     tags:
 *       - Me
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PermissionDto'
 */
router.get(
	'/permissions',
	permissionMiddleware({
		needAuth: true,
	}),
	PermissionController.getMe
);

/**
 * @openapi
 * /api/me/profile:
 *   put:
 *     summary: Update current user's profile
 *     tags:
 *       - Me
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateDTO'
 *     responses:
 *       200:
 *         description: Updated profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 */
router.put(
	'/profile',
	permissionMiddleware({
		needAuth: true,
	}),
	UserController.updateMe
);

/**
 * @openapi
 * /api/me/jobrole:
 *   get:
 *     summary: Get job roles of current user
 *     tags:
 *       - Me
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: List of job roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JobRoleDTO'
 */
router.get(
	'/jobrole',
	permissionMiddleware({
		needAuth: true,
	}),
	JobRoleController.getMyJobroles
);

/**
 * @openapi
 * /api/me/jobrole/{id}/skills:
 *   get:
 *     summary: Get my skills for a specific job role
 *     tags:
 *       - Me
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of skills for the job role
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserSkillSearchDto'
 */
router.get(
	'/jobrole/:id/skills',
	permissionMiddleware({
		needAuth: true,
	}),
	JobRoleController.getMySkillsByJobrole
);

/**
 * @openapi
 * /api/me/skills:
 *   get:
 *     summary: Get all my skills
 *     tags:
 *       - Me
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: List of all my skills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserSkillSearchDto'
 */
router.get(
	'/skills',
	permissionMiddleware({
		needAuth: true,
	}),
	UserController.getMyAllSkills
);

router.get(
	'/stats',
	permissionMiddleware({
		needAuth: true,
	}),
	UserController.getMyStats
);

export default router;
