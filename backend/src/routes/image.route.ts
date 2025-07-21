import express from 'express';
import ImageController from '../controllers/image.controller';
import upload from '../middlewares/upload.middleware';

const router = express.Router();

/**
 * @openapi
 * /image/upload:
 *   post:
 *     summary: Upload an image file
 *     description: Uploads an image, converts it to WEBP, creates a thumbnail, and returns metadata.
 *     tags:
 *       - Image
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageDTO'
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Failed to process file or unsupported mime type
 */
router.post(
	'/upload',
	upload.single('image'),
	ImageController.upload,
);

/**
 * @openapi
 * /image/{id}:
 *   get:
 *     summary: Get image by ID
 *     description: Returns the image file or its thumbnail by ID.
 *     tags:
 *       - Image
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Image ID
 *       - in: query
 *         name: thumb
 *         required: false
 *         schema:
 *           type: boolean
 *         description: If true, returns thumbnail
 *     responses:
 *       200:
 *         description: Image file
 *         content:
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 */
router.get(
	'/:id',
	ImageController.getById,
);

export default router;
