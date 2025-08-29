import { Request, Response, NextFunction } from 'express';
import AnalyticsService from "../services/analytics.service";

class AnalyticsController {
	async kpi(req: Request, res: Response, next: NextFunction) {
		try {
			const kpi = await AnalyticsService.kpi();
			
			res.json(kpi);
		} catch (err) {
			next(err);
		}
	}
	
	async jobRolesToSkills(req: Request, res: Response, next: NextFunction) {
		try {
			const data = await AnalyticsService.jobRolesToSkills();
			
			res.json(data);
		} catch (err) {
			next(err);
		}
	}
	
	async jobRoleToSkills(req: Request, res: Response, next: NextFunction) {
		try {
			const {userId, jobRoleId} = req.query;
			
			const data = await AnalyticsService.jobRoleToSkills(jobRoleId as string, userId as string);
			
			res.json(data);
		} catch (err) {
			next(err);
		}
	}

	async downloadKPI(req: Request, res: Response, next: NextFunction) {
		try {
			const file = await AnalyticsService.downloadKPI();
			res.setHeader('Content-Type', file.contentType);
			res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`);
			res.send(file.buffer);
		} catch (err) {
			next(err);
		}
	}

	async downloadJobRolesToSkills(req: Request, res: Response, next: NextFunction) {
		try {
			const file = await AnalyticsService.downloadJobRolesToSkills();
			res.setHeader('Content-Type', file.contentType);
			res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`);
			res.send(file.buffer);
		} catch (err) {
			next(err);
		}
	}

	async downloadJobRoleToSkills(req: Request, res: Response, next: NextFunction) {
		try {
			const { jobRoleId, userId } = req.query;
			const file = await AnalyticsService.downloadJobRoleToSkills(jobRoleId as string, userId as string | undefined);
			res.setHeader('Content-Type', file.contentType);
			res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`);
			res.send(file.buffer);
		} catch (err) {
			next(err);
		}
	}

	async downloadSkillToUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const { skillId } = req.params;
			const file = await AnalyticsService.downloadSkillToUsers(skillId);
			res.setHeader('Content-Type', file.contentType);
			res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`);
			res.send(file.buffer);
		} catch (err) {
			next(err);
		}
	}

	async downloadUserToSkills(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId } = req.params;
			const file = await AnalyticsService.downloadUserToSkills(userId);
			res.setHeader('Content-Type', file.contentType);
			res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`);
			res.send(file.buffer);
		} catch (err) {
			next(err);
		}
	}

	async skillToUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const { skillId } = req.params;
			
			const data = await AnalyticsService.skillToUsers(skillId);
			
			res.json(data);
		} catch (err) {
			next(err);
		}
	}

	async userToSkills(req: Request, res: Response, next: NextFunction) {
		try {
			const { userId } = req.params;
			
			const data = await AnalyticsService.userToSkills(userId);
			
			res.json(data);
		} catch (err) {
			next(err);
		}
	}

	async getMySkillsStat(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.authUser!.id;
			
			const data = await AnalyticsService.userToSkills(userId);
			
			res.json(data);
		} catch (err) {
			next(err);
		}
	}

	async downloadMySkillsStat(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.authUser!.id;
			
			const file = await AnalyticsService.downloadUserToSkills(userId);
			res.setHeader('Content-Type', file.contentType);
			res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`);
			res.send(file.buffer);
		} catch (err) {
			next(err);
		}
	}
	
}

export default new AnalyticsController();
