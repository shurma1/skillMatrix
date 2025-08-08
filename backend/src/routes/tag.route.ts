import express from 'express';
import TagController from '../controllers/tag.controller';
import permissionMiddleware from "../middlewares/permission.middleware";

const router = express.Router();

/**
 * @openapi
 * /api/tag/search:
 *   get:
 *     summary: Search tags
 *     tags:
 *       - Tag
 *     security:
 *       - JWT: []
 *     x-permissions: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TagSearchDTO'
 */
router.get(
	'/search',
	permissionMiddleware({
		needAuth: true,
	}),
	TagController.search
);

/**
 * @openapi
 * /api/tag/{id}:
 *   get:
 *     summary: Get tag by id
 *     tags:
 *       - Tag
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
 *         description: Tag
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TagDTO'
 */
router.get(
	'/:id',
	permissionMiddleware({
		needAuth: true,
	}),
	TagController.get
);

/**
 * @openapi
 * /api/tag:
 *   post:
 *     summary: Create tag
 *     tags:
 *       - Tag
 *     security:
 *       - JWT: []
 *     x-permissions:
 *       - EDIT_ALL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagCreateDTO'
 *     responses:
 *       200:
 *         description: Created tag
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TagDTO'
 */
router.post(
	'/',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	TagController.create
);

/**
 * @openapi
 * /api/tag/{id}:
 *   put:
 *     summary: Update tag
 *     tags:
 *       - Tag
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
 *             $ref: '#/components/schemas/TagUpdateDTO'
 *     responses:
 *       200:
 *         description: Updated tag
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TagDTO'
 */
router.put(
	'/:id',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	TagController.update
);

/**
 * @openapi
 * /api/tag/{id}:
 *   delete:
 *     summary: Delete tag
 *     tags:
 *       - Tag
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
	TagController.delete
);

export default router;
