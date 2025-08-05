import express from 'express';
import ImageController from '../controllers/image.controller';
import upload from '../middlewares/upload.middleware';

const router = express.Router();

router.post(
	'/upload',
	upload.single('image'),
	ImageController.upload,
);

router.get(
	'/:id',
	ImageController.get,
);

router.get(
	'/:id/info',
	ImageController.getInfo,
);

export default router;
