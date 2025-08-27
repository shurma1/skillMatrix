import express from 'express';
import ImageRoute from "./image.route";
import UserRoute from "./user.route";
import JobRoleRoute from "./jobRole.route";
import SkillRoute from "./skill.route";
import FileRoute from "./file.route";
import TagRoute from "./tag.route";
import TestRoute from "./test.route";
import AuthRoute from "./auth.route";
import MeRoute from "./me.route";
import AnalyticsRoute from "./analytics.route";
import PermissionRoute from "./permisson.route";

const router = express.Router();

router.use('/image', ImageRoute);
router.use('/user', UserRoute);
router.use('/jobrole', JobRoleRoute);
router.use('/skill', SkillRoute);
router.use('/file', FileRoute);
router.use('/tag', TagRoute);
router.use('/test', TestRoute);
router.use('/auth', AuthRoute);
router.use('/me', MeRoute);
router.use('/analytics', AnalyticsRoute)
router.use('/permissions', PermissionRoute)


export default router;
