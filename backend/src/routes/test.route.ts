import express from 'express';
import TestController from '../controllers/test.controller';
import {createTest} from "../schemas/test/createTest";
import {validateSchema} from "../middlewares/validateSchema.middleware";

const router = express.Router({ mergeParams: true });

router.post(
	'/',
	validateSchema(createTest()),
	TestController.createTest
);
router.post('/start', TestController.startTest);
router.post('/end', TestController.endTest);
router.post('/sendAnswer', TestController.sendAnswer);

router.get('/result', TestController.getUserTestResult);
router.get('/:testId', TestController.getTest);

export default router;
