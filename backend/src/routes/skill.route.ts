import express from 'express';
import SkillController from "../controllers/skill.controller";
import permissionMiddleware from "../middlewares/permission.middleware";

const router = express.Router();

/**
 * @openapi
 * /api/skill/search:
 *   get:
 *     summary: Search skills with filters
 *     tags:
 *       - Skill
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
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated tag IDs
 *       - in: query
 *         name: authorIds
 *         schema:
 *           type: string
 *       - in: query
 *         name: verifierIds
 *         schema:
 *           type: string
 *       - in: query
 *         name: approvedDates
 *         schema:
 *           type: string
 *         description: Comma-separated ISO dates
 *       - in: query
 *         name: auditDates
 *         schema:
 *           type: string
 *         description: Comma-separated ISO dates
 *     responses:
 *       200:
 *         description: Array of skills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SkillWithCurrentVersionDTO'
 */
router.get(
	'/search',
	permissionMiddleware({
		needAuth: true,
		permission: ['VIEW_ALL']
	}),
	SkillController.search
);

/**
 * @openapi
 * /api/skill:
 *   post:
 *     summary: Create a skill
 *     tags:
 *       - Skill
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
 *             required: [type, title, isActive]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [skill, document]
 *               title:
 *                 type: string
 *               approvedDate:
 *                 type: string
 *                 format: date-time
 *               auditDate:
 *                 type: string
 *                 format: date-time
 *               verifierId:
 *                 type: string
 *               authorId:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Created skill
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SkillWithCurrentVersionDTO'
 */
router.post(
	'/',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	SkillController.create
);

/**
 * @openapi
 * /api/skill/{id}:
 *   delete:
 *     summary: Delete skill
 *     tags:
 *       - Skill
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
 */
router.delete(
	'/:id',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	SkillController.delete
);

/**
 * @openapi
 * /api/skill/{id}:
 *   put:
 *     summary: Update skill
 *     tags:
 *       - Skill
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
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated skill
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SkillWithCurrentVersionDTO'
 */
router.put(
	'/:id',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	SkillController.update
);

/**
 * @openapi
 * /api/skill/{id}:
 *   get:
 *     summary: Get skill by id
 *     tags:
 *       - Skill
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Skill
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SkillWithCurrentVersionDTO'
 */
router.get(
	'/:id',
	SkillController.get
);


/**
 * @openapi
 * /api/skill/{id}/user:
 *   get:
 *     summary: List users who have the skill
 *     tags:
 *       - Skill
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
 *                 $ref: '#/components/schemas/UserSkillSearchDto'
 */
router.get(
	'/:id/user',
	permissionMiddleware({
		needAuth: true,
		permission: ['VIEW_ALL']
	}),
	SkillController.getAllUsers
)


/**
 * @openapi
 * /api/skill/{id}/tag:
 *   post:
 *     summary: Add tag to skill
 *     tags:
 *       - Skill
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tagId]
 *             properties:
 *               tagId:
 *                 type: string
 *     responses:
 *       204:
 *         description: Added
 */
router.post(
	'/:id/tag',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	SkillController.addTag
);

/**
 * @openapi
 * /api/skill/{id}/tags:
 *   get:
 *     summary: Get tags of skill
 *     tags:
 *       - Skill
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TagDTO'
 */
router.get(
	'/:id/tags',
	SkillController.getTags
);

/**
 * @openapi
 * /api/skill/{id}/tag/{tagId}:
 *   delete:
 *     summary: Remove tag from skill
 *     tags:
 *       - Skill
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
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Removed
 *     x-todo: add detailed schema/notes
 */
router.delete(
	'/:id/tag/:tagId',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	SkillController.deleteTag
);


/**
 * @openapi
 * /api/skill/{id}/version:
 *   post:
 *     summary: Create skill version
 *     tags:
 *       - Skill
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
 *             required: [fileId, authorId, verifierid]
 *             properties:
 *               fileId:
 *                 type: string
 *               authorId:
 *                 type: string
 *               verifierid:
 *                 type: string
 *     responses:
 *       200:
 *         description: Version created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SkillVersionDTO'
 */
router.post(
	'/:id/version',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	SkillController.createVersion
);

/**
 * @openapi
 * /api/skill/{id}/version:
 *   get:
 *     summary: List versions of a skill
 *     tags:
 *       - Skill
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
 *         description: Versions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SkillVersionDTO'
 */
router.get(
	'/:id/version',
	permissionMiddleware({
		needAuth: true,
		permission: ['VIEW_ALL']
	}),
	SkillController.getVersions
);

/**
 * @openapi
 * /api/skill/{id}/version/{versionId}:
 *   get:
 *     summary: Get specific version of a skill
 *     tags:
 *       - Skill
 *     security:
 *       - JWT: []
 *     x-permissions: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: versionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Version
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SkillVersionDTO'
 */
router.get(
	'/:id/version/:versionId',
	permissionMiddleware({
		needAuth: true,
	}),
	SkillController.getVersion
);

/**
 * @openapi
 * /api/skill/{id}/version/{versionId}:
 *   delete:
 *     summary: Delete version
 *     tags:
 *       - Skill
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
 *         name: versionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete(
	'/:id/version/:versionId',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	SkillController.deleteVersion
);

export default router;
