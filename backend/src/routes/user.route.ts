import express from 'express';
import UserController from '../controllers/user.controller';
import {validateSchema} from "../middlewares/validateSchema.middleware";
import {createUser} from "../schemas/user/createUser";
import {updateUser} from "../schemas/user/updateUser";
import {checkID} from "../schemas/common/checkID";
import permissionMiddleware from "../middlewares/permission.middleware";

const router = express.Router();

/**
 * @openapi
 * /api/user/search:
 *   get:
 *     summary: Search users
 *     tags:
 *       - User
 *     security:
 *       - JWT: []
 *     x-permissions:
 *       - VIEW_ALL
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserDTO'
 */
router.get(
	'/search',
	permissionMiddleware({
		needAuth: true,
		permission: ['VIEW_ALL']
	}),
	UserController.search
);

/**
 * @openapi
 * /api/user:
 *   post:
 *     summary: Create a user
 *     tags:
 *       - User
 *     security:
 *       - JWT: []
 *     x-permissions:
 *       - EDIT_ALL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateDTO'
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 */
router.post(
	'/',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	validateSchema(createUser()),
	UserController.create
);

/**
 * @openapi
 * /api/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - User
 *     security:
 *       - JWT: []
 *     x-permissions:
 *       - VIEW_ALL
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       404:
 *         description: Not found
 */
router.get(
	'/:id',
	permissionMiddleware({
		needAuth: true,
		permission: ['VIEW_ALL']
	}),
	validateSchema(checkID(), ['params']),
	UserController.getByID
);

/**
 * @openapi
 * /api/user/{id}:
 *   put:
 *     summary: Update user
 *     tags:
 *       - User
 *     security:
 *       - JWT: []
 *     x-permissions:
 *       - EDIT_ALL
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateDTO'
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       404:
 *         description: Not found
 */
router.put(
	'/:id',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	validateSchema(checkID(), ['params']),
	validateSchema(updateUser()),
	UserController.update
);


/**
 * @openapi
 * /api/user/{id}:
 *   delete:
 *     summary: Delete user
 *     tags:
 *       - User
 *     security:
 *       - JWT: []
 *     x-permissions:
 *       - EDIT_ALL
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete(
	'/:id',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	validateSchema(checkID(), ['params']),
	UserController.delete
);

/**
 * @openapi
 * /api/user/{id}/skill:
 *   get:
 *     summary: List user skills
 *     tags:
 *       - User
 *     security:
 *       - JWT: []
 *     x-permissions: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skills list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserSkillSearchDto'
 *   post:
 *     summary: Add skill to user
 *     tags:
 *       - User
 *     security:
 *       - JWT: []
 *     x-permissions: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddUserSkillDTO'
 *     responses:
 *       200:
 *         description: User skill
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSkillDto'
 */
router.get(
	'/:id/skill/',
	permissionMiddleware({
		needAuth: true,
	}),
	UserController.getAllSkills
);
router.post(
	'/:id/skill/',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	UserController.addSkill
);

/**
 * @openapi
 * /api/user/{id}/skill/{skillId}:
 *   get:
 *     summary: Get specific user skill
 *     tags:
 *       - User
 *     security:
 *       - JWT: []
 *     x-permissions:
 *       - EDIT_ALL
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User skill
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSkillDto'
 *   put:
 *     summary: Update user skill target level
 *     tags:
 *       - User
 *     security:
 *       - JWT: []
 *     x-permissions:
 *       - EDIT_ALL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserSkillTargetLevelDTO'
 *     responses:
 *       200:
 *         description: Updated user skill
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSkillDto'
 *   delete:
 *     summary: Remove skill from user
 *     tags:
 *       - User
 *     security:
 *       - JWT: []
 *     x-permissions: []
 *     responses:
 *       204:
 *         description: Deleted
 */
router.get(
	'/:id/skill/:skillId',
	permissionMiddleware({
		needAuth: true,
	}),
	UserController.getSkill
);
router.put(
	'/:id/skill/:skillId',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	UserController.updateSkill
);
router.delete(
	'/:id/skill/:skillId',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	UserController.deleteSkill
);



/**
 * @openapi
 * /api/user/{id}/jobrole:
 *   get:
 *     summary: List user job roles
 *     tags:
 *       - User
 *     security:
 *       - JWT: []
 *     x-permissions: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JobRoleDTO'
 *   post:
 *     summary: Add job role to user
 *     tags:
 *       - User
 *     security:
 *       - JWT: []
 *     x-permissions:
 *       - EDIT_ALL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddUserJobroleDTO'
 *     responses:
 *       200:
 *         description: Added job role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobRoleDTO'
 */
router.get(
	'/:id/jobrole/',
	permissionMiddleware({
		needAuth: true,
	}),
	UserController.getAllJobRoles
);
router.post(
	'/:id/jobrole/',
	permissionMiddleware({
		needAuth: true,
	}),
	UserController.addJobrole
);

/**
 * @openapi
 * /api/user/{id}/jobrole/{jobroleId}:
 *   get:
 *     summary: List user skills in job role
 *     tags:
 *       - User
 *     security:
 *       - JWT: []
 *     x-permissions:
 *       - EDIT_ALL
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: jobroleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserSkillSearchDto'
 *   delete:
 *     summary: Remove job role from user
 *     tags:
 *       - User
 *     responses:
 *       204:
 *         description: Deleted
 */
router.get(
	'/:id/jobrole/:jobroleId/skill',
	permissionMiddleware({
		needAuth: true,
	}),
	UserController.getAllSkillsByJobrole
);
router.delete(
	'/:id/jobrole/:jobroleId',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	UserController.deleteJobrole
);



/**
 * @openapi
 * /api/user/{id}/skill/{skillId}/confirmation:
 *   get:
 *     summary: Get confirmations for user skill
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Confirmations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ConfirmationDTO'
 *   post:
 *     summary: Add confirmation to user skill
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfirmationDTO'
 *     responses:
 *       200:
 *         description: Confirmation added
 */
router.get(
	'/:id/skill/:skillId/confirmation',
	permissionMiddleware({
		needAuth: true,
	}),
	UserController.getConfirmations
);
router.post(
	'/:id/skill/:skillId/confirmation',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	UserController.addConfirmation
);

/**
 * @openapi
 * /api/user/{id}/skill/{skillId}/confirmation/{confirmationId}:
 *   delete:
 *     summary: Delete confirmation
 *     tags:
 *       - User
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete(
	'/:id/skill/:skillId/confirmation/:confirmationId',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	UserController.deleteConfirmation
);

export default router;
