import express from 'express';
import FileController from "../controllers/file.controller";
import upload from "../middlewares/upload.middleware";
import permissionMiddleware from "../middlewares/permission.middleware";

const router = express.Router();

/**
 * @openapi
 * /api/file/{id}:
 *   get:
 *     summary: Download file by id
 *     tags:
 *       - File
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
 *         description: Binary file stream
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 */
router.get(
	'/:id',
	permissionMiddleware({
		needAuth: true
	}),
	FileController.get
);

/**
 * @openapi
 * /api/file/{id}/info:
 *   get:
 *     summary: Get file metadata
 *     tags:
 *       - File
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
 *         description: File metadata
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileDTO'
 *       404:
 *         description: File not found
 */
router.get(
	'/:id/info',
	permissionMiddleware({
		needAuth: true
	}),
	FileController.getInfo
);

/**
 * @openapi
 * /api/file:
 *   post:
 *     summary: Upload a file
 *     tags:
 *       - File
 *     security:
 *       - JWT: []
 *     x-permissions: [EDIT_ALL]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, file]
 *             properties:
 *               name:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileDTO'
 *       400:
 *         description: No file uploaded
 *       403:
 *         description: Permission denied
 */
router.post(
	'/',
	permissionMiddleware({
		needAuth: true,
		permission: ['EDIT_ALL']
	}),
	upload.single('file'),
	FileController.upload
);



router.get(
	'/:id/confirm',
	permissionMiddleware({
		needAuth: true
	}),
	FileController.confirm
);

export default router;
