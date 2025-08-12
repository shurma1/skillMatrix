import express from 'express';
import ImageController from '../controllers/image.controller';
import upload from '../middlewares/upload.middleware';
import permissionMiddleware from "../middlewares/permission.middleware";

const router = express.Router();

/**
 * @openapi
 * /api/image/upload:
 *   post:
 *     summary: Upload image
 *     tags:
 *       - Image
 *     security:
 *       - JWT: []
 *     x-permissions: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageDTO'
 */
router.post(
	'/upload',
	permissionMiddleware({
		needAuth: true,
	}),
	upload.single('image'),
	ImageController.upload,
);


/**
 * @openapi
 * /api/image/{id}:
 *   get:
 *     summary: Get image by id
 *     tags:
 *       - Image
 *     security:
 *       - JWT: []
 *     x-permissions: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: thumb
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Return thumbnail if true
 *     responses:
 *       200:
 *         description: Image file
 *         content:
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image not found
 */
router.get(
	'/:id',
	ImageController.get,
);

/**
 * @openapi
 * /api/image/{id}/info:
 *   get:
 *     summary: Get image metadata
 *     tags:
 *       - Image
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
 *         description: Image metadata
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageDTO'
 *       404:
 *         description: Image not found
 */
router.get(
	'/:id/info',
	permissionMiddleware({
		needAuth: true,
	}),
	ImageController.getInfo,
);

export default router;
