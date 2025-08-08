import express from 'express';
import JobRoleController from '../controllers/jobRole.controller';
import permissionMiddleware from "../middlewares/permission.middleware";

const router = express.Router();

/**
 * @openapi
 * /api/jobrole/search:
 *   get:
 *     summary: Search job roles
 *     tags:
 *       - JobRole
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
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated job roles
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
 *                     $ref: '#/components/schemas/JobRoleDTO'
 */
router.get(
	'/search',
	permissionMiddleware({
		needAuth: true,
		permission: ['VIEW_ALL']
	}),
	JobRoleController.search
);

/**
 * @openapi
 * /api/jobrole:
 *   post:
 *     summary: Create job role
 *     tags:
 *       - JobRole
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobRoleDTO'
 *       403:
 *         description: Permission denied
 */
router.post(
	'/',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	JobRoleController.create
);

/**
 * @openapi
 * /api/jobrole/{id}:
 *   get:
 *     summary: Get job role by id
 *     tags:
 *       - JobRole
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
 *         description: Job role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobRoleDTO'
 *       404:
 *         description: Not found
 */
router.get(
	'/:id',
	permissionMiddleware({
		needAuth: true,
	}),
	JobRoleController.getByID
);
/**
 * @openapi
 * /api/jobrole/{id}:
 *   put:
 *     summary: Update job role
 *     tags:
 *       - JobRole
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
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated job role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobRoleDTO'
 *       403:
 *         description: Permission denied
 */
router.put(
	'/:id',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	JobRoleController.update
);

/**
 * @openapi
 * /api/jobrole/{id}:
 *   delete:
 *     summary: Delete job role
 *     tags:
 *       - JobRole
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
 *       403:
 *         description: Permission denied
 */
router.delete(
	'/:id',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	JobRoleController.delete
);


/**
 * @openapi
 * /api/jobrole/{id}/user:
 *   get:
 *     summary: List users assigned to job role
 *     tags:
 *       - JobRole
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
 *         description: Users list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserJobRoleSearchDTO'
 *   post:
 *     summary: Assign user to job role
 *     tags:
 *       - JobRole
 *     security:
 *       - JWT: []
 *     x-permissions:
 *       - EDIT_ALL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Assignment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 */
router.get('/:id/user',
	permissionMiddleware({
		needAuth: true,
		permission: ['VIEW_ALL']
	}),
	JobRoleController.getUsers
);

router.post(
	'/:id/user',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	JobRoleController.addUser
);

/**
 * @openapi
 * /api/jobrole/{id}/user/{userId}:
 *   delete:
 *     summary: Unassign user from job role
 *     tags:
 *       - JobRole
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
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Removed
 */
router.delete(
	'/:id/user/:userId',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	JobRoleController.deleteUser
);


/**
 * @openapi
 * /api/jobrole/{id}/skill:
 *   get:
 *     summary: List job role skills
 *     tags:
 *       - JobRole
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
 *                 $ref: '#/components/schemas/JobRoleSkillSearchDTO'
 *   post:
 *     summary: Add skill to job role
 *     tags:
 *       - JobRole
 *     security:
 *       - JWT: []
 *     x-permissions:
 *       - EDIT_ALL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [skillId, targetLevel]
 *             properties:
 *               skillId:
 *                 type: string
 *               targetLevel:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Added skill
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobRoleSkillSearchDTO'
 */
router.get(
	'/:id/skill',
	permissionMiddleware({
		needAuth: true
	}),
	JobRoleController.getSkills
);

router.post(
	'/:id/skill',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	JobRoleController.addSkill
);

/**
 * @openapi
 * /api/jobrole/{id}/skill/{skillId}:
 *   put:
 *     summary: Update job role skill target level
 *     tags:
 *       - JobRole
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetLevel]
 *             properties:
 *               targetLevel:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobRoleSkillSearchDTO'
 *   delete:
 *     summary: Remove skill from job role
 *     tags:
 *       - JobRole
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
 *       204:
 *         description: Deleted
 */
router.put(
	'/:id/skill/:skillId',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']}),
	JobRoleController.updateSkill
);

router.delete(
	'/:id/skill/:skillId',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	JobRoleController.deleteSkill
);

export default router;
