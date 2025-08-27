import express from 'express';
import permissionMiddleware from "../middlewares/permission.middleware";
import PermissionController from "../controllers/permission.controller";

const router = express.Router();

router.get(
	'/',
	permissionMiddleware({
		needAuth: true,
	}),
	PermissionController.getAll
);

export default router;
