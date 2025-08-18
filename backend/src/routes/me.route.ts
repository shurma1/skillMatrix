import express from 'express';
import UserController from '../controllers/user.controller';
import permissionMiddleware from "../middlewares/permission.middleware";
import JobRoleController from "../controllers/jobRole.controller";
import SkillController from "../controllers/skill.controller";

const router = express.Router();

router.get(
	'/profile',
	permissionMiddleware({
		needAuth: true,
	}),
	UserController.getMe
);

router.put(
	'/profile',
	permissionMiddleware({
		needAuth: true,
	}),
	UserController.updateMe
);

router.get(
	'/jobrole',
	permissionMiddleware({
		needAuth: true,
	}),
	JobRoleController.getMyJobroles
);

router.get(
	'/jobrole/:id/skills',
	permissionMiddleware({
		needAuth: true,
	}),
	JobRoleController.getMySkillsByJobrole
);

router.get(
	'/skills',
	permissionMiddleware({
		needAuth: true,
	}),
	UserController.getMyAllSkills
);

export default router;
