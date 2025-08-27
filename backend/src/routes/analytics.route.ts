import express from 'express';
import AuthController from "../controllers/auth.controller";
import AnalyticsController from "../controllers/analytics.controller";

const router = express.Router();


router.get(
	'/kpi',
	AnalyticsController.kpi
);

router.get(
	'/kpi/download',
	AnalyticsController.downloadKPI
);

router.get(
	'/jobRolesToSkills',
	AnalyticsController.jobRolesToSkills
)

router.get(
	'/jobRolesToSkills/download',
	AnalyticsController.downloadJobRolesToSkills
)

router.get(
	'/jobRoleToSkills',
	AnalyticsController.jobRoleToSkills
)

router.get(
	'/jobRoleToSkills/download',
	AnalyticsController.downloadJobRoleToSkills
)

export default router;
