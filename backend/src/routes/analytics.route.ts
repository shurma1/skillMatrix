import express from 'express';
import AnalyticsController from "../controllers/analytics.controller";
import permissionMiddleware from "../middlewares/permission.middleware";

const router = express.Router();

router.get(
	'/getResultPreview',
	AnalyticsController.getResultPreview
);

/**
 * @openapi
 * /api/analytics/datesFamiliarization/{skillId}:
 *   get:
 *     summary: Get dates of familiarization for a specific skill
 *     description: Returns all users connected to a skill with their familiarization dates
 *     tags:
 *       - Analytics
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The skill ID to get familiarization dates for
 *     responses:
 *       200:
 *         description: Users with their familiarization dates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 colLabels:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["ФИО", "Дата ознакомления"]
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fio:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date
 *                         nullable: true
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Internal server error
 */
router.get(
	'/datesFamiliarization/:skillId',
	permissionMiddleware({
		needAuth: true,
		permission: ['ANALYTICS_VIEW']
	}),
	AnalyticsController.datesFamiliarization
);

router.get(
	'/datesFamiliarization/:skillId/download',
	permissionMiddleware({
		needAuth: true,
		permission: ['ANALYTICS_VIEW']
	}),
	AnalyticsController.downloadDatesFamiliarization
);

router.get(
	'/kpi',
	permissionMiddleware({
		needAuth: true,
		permission: ['ANALYTICS_VIEW']
	}),
	AnalyticsController.kpi
);

router.get(
	'/kpi/download',
	permissionMiddleware({
		needAuth: true,
		permission: ['ANALYTICS_VIEW']
	}),
	AnalyticsController.downloadKPI
);

router.get(
	'/jobRolesToSkills',
	permissionMiddleware({
		needAuth: true,
		permission: ['ANALYTICS_VIEW']
	}),
	AnalyticsController.jobRolesToSkills
)

router.get(
	'/jobRolesToSkills/download',
	permissionMiddleware({
		needAuth: true,
		permission: ['ANALYTICS_VIEW']
	}),
	AnalyticsController.downloadJobRolesToSkills
)

router.get(
	'/jobRoleToSkills',
	permissionMiddleware({
		needAuth: true,
		permission: ['ANALYTICS_VIEW']
	}),
	AnalyticsController.jobRoleToSkills
)

router.get(
	'/jobRoleToSkills/download',
	permissionMiddleware({
		needAuth: true,
		permission: ['ANALYTICS_VIEW']
	}),
	AnalyticsController.downloadJobRoleToSkills
)

/**
 * @openapi
 * /api/analytics/skillToUsers/{skillId}:
 *   get:
 *     summary: Get all users related to a specific skill
 *     description: Returns all users connected to a skill either directly through userToSkills or indirectly through job roles
 *     tags:
 *       - Analytics
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The skill ID to get users for
 *     responses:
 *       200:
 *         description: Users related to the skill with their levels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 skill:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     title:
 *                       type: string
 *                     version:
 *                       type: number
 *                     documentId:
 *                       type: string
 *                       nullable: true
 *                 colLabels:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["ФИО", "Логин", "Тип связи", "Необходимый уровень", "Текущий уровень", "%"]
 *                 data:
 *                   type: array
 *                   items:
 *                     type: array
 *                     items:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 *       404:
 *         description: Skill not found
 *       500:
 *         description: Internal server error
 */
router.get(
	'/skillToUsers/:skillId',
	AnalyticsController.skillToUsers
)

router.get(
	'/skillToUsers/:skillId/download',
	AnalyticsController.downloadSkillToUsers
)

/**
 * @openapi
 * /api/analytics/userToSkills/{userId}:
 *   get:
 *     summary: Get all skills related to a specific user
 *     description: Returns all skills connected to a user either directly through userToSkills or indirectly through job roles
 *     tags:
 *       - Analytics
 *     security:
 *       - JWT: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The user ID to get skills for
 *     responses:
 *       200:
 *         description: Skills related to the user with their levels and verification info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     login:
 *                       type: string
 *                     firstname:
 *                       type: string
 *                     lastname:
 *                       type: string
 *                     patronymic:
 *                       type: string
 *                       nullable: true
 *                 left:
 *                   type: object
 *                   description: Skill information columns
 *                 middle:
 *                   type: object
 *                   description: Target levels and user header info
 *                 right:
 *                   type: object
 *                   description: Current user levels
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalTargetLevel:
 *                       type: number
 *                     totalCurrentLevel:
 *                       type: number
 *                     totalPercent:
 *                       type: number
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get(
	'/userToSkills/:userId',
	AnalyticsController.userToSkills
)

router.get(
	'/userToSkills/:userId/download',
	AnalyticsController.downloadUserToSkills
)

export default router;
