import express from 'express';
import FileController from "../controllers/file.controller";
import upload from "../middlewares/upload.middleware";

const router = express.Router();

router.get('/:id', FileController.get);

router.get('/:id/info', FileController.getInfo);

router.post(
	'/',
	upload.single('file'),
	FileController.upload
);

export default router;
