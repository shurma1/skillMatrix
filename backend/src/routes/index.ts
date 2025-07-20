import express from 'express';
import ImageRoute from "./image.route";

const router = express.Router();

router.use('/image', ImageRoute);

export default router;
