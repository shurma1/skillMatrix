import { Request, Response, NextFunction } from 'express';
import TestService from '../services/test.service';
import { CreateTestDTO, SendAnswerDTO } from '../dtos/test.dto';

class TestController {
	async createTest(req: Request, res: Response, next: NextFunction) {
		try {
			const { needScore, timeLimit, questions, title, skillId } = req.body;
			
			const testCreateDto = new CreateTestDTO( needScore, timeLimit, title, questions);
			
			const test = await TestService.createTest(skillId, testCreateDto);
			
			res.status(200).json(test);
		} catch (err) {
			next(err);
		}
	}

	async startTest(req: Request, res: Response, next: NextFunction) {
		try {
			const { testId } = req.body;
			
			const userId = req.authUser!.id;
			
			const session = await TestService.startTest(testId, userId);
			res.status(200).json(session);
		} catch (err) {
			next(err);
		}
	}
	
	async endTest(req: Request, res: Response, next: NextFunction) {
		try {
			const { sessionId } = req.body;
			
			const userId = req.authUser!.id;
			
			await TestService.endTest(sessionId, userId);
			res.status(200).send();
		} catch (err) {
			next(err);
		}
	}

	async sendAnswer(req: Request, res: Response, next: NextFunction) {
		try {
			const { sessionId } = req.body;
			const userId = req.authUser!.id;
			const dto = req.body as SendAnswerDTO;
			const result = await TestService.sendAnswer(sessionId, userId, dto);
			res.status(200).json(result);
		} catch (err) {
			next(err);
		}
	}

	async getUserTestResult(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.authUser!.id;
			const { testId } = req.params;
			const result = await TestService.getUserTestResult(testId, userId);
			res.status(200).json(result);
		} catch (err) {
			next(err);
		}
	}

	// For curators/admins: get user test result by explicit userId
	async getUserTestResultByUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { testId, userId } = req.params as { testId: string; userId: string };
			const result = await TestService.getUserTestResult(testId, userId);
			res.status(200).json(result);
		} catch (err) {
			next(err);
		}
	}

	async deleteUserTestResult(req: Request, res: Response, next: NextFunction) {
		try {
			const { testId, userId } = req.params as { testId: string; userId: string };
			await TestService.deleteUserResult(testId, userId);
			res.status(200).send();
		} catch (err) {
			next(err);
		}
	}

	async canDeleteTest(req: Request, res: Response, next: NextFunction) {
		try {
			const { testId } = req.params as { testId: string };
			const requesterId = req.authUser!.id;
			const permissions = (req as any).permissions as string[] | undefined;
			const can = await TestService.canDeleteTest(testId, requesterId, permissions || []);
			res.status(200).json({ can });
		} catch (err) {
			next(err);
		}
	}
	
	async getTest(req: Request, res: Response, next: NextFunction) {
		try {
			const { testId } = req.params;
			
			const result = await TestService.getTest(testId);
			
			res.status(200).json(result);
		} catch (err) {
			next(err);
		}
	}

	async getTestFull(req: Request, res: Response, next: NextFunction) {
		try {
			const { testId } = req.params;
			const result = await TestService.getTestFull(testId);
			res.status(200).json(result);
		} catch (err) {
			next(err);
		}
	}

	async updateTest(req: Request, res: Response, next: NextFunction) {
		try {
			const { testId } = req.params as { testId: string };
			const dto = req.body as CreateTestDTO;
			const updated = await TestService.updateTest(testId, dto);
			res.status(200).json(updated);
		} catch (err) {
			next(err);
		}
	}
}

export default new TestController();
