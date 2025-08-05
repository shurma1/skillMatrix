import express from 'express';
import ImageRoute from "./image.route";
import UserRoute from "./user.route";
import JobRoleRoute from "./jobRole.route";
import SkillRoute from "./skill.route";
import FileRoute from "./file.route";
import TagRoute from "./tag.route";
import TestRoute from "./test.route";

const router = express.Router();

router.use('/image', ImageRoute);
router.use('/user', UserRoute);
router.use('/jobrole', JobRoleRoute);
router.use('/skill', SkillRoute);
router.use('/file', FileRoute);
router.use('/tag', TagRoute);
router.use('/test', TestRoute);


export default router;
