import { Request, Response, NextFunction } from 'express';
import SkillService from "../services/skill.service";
import {parseQueryArray} from "../utils/parseQueryArray";
import {parseQueryDates} from "../utils/parseQueryDates";
import calcPageLimitAndOffset from "../utils/calcPageLimitAndOffset";

class SkillController {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const {
				type,
				title,
				approvedDate,
				verifierId,
				authorId,
				fileId
			} = req.body;
			
			const skill = await SkillService.create({
				type,
				title,
				approvedDate,
				verifierId,
				authorId,
				fileId
			})
			
			res.status(200).json(skill);
		} catch (err) {
			next(err);
		}
	}
	
	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			
			await SkillService.delete(id);
			
			res.status(204).send();
		} catch (err) {
			next(err);
		}
	}
	
	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const { title, isActive } = req.body;
			
			const skill = await SkillService.update(id, title, isActive);
			
			res.send(skill);
		} catch (err) {
			next(err);
		}
	}
	
	async get(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const userId = req.authUser!.id;
			
			const skill = await SkillService.get(id);
			
			await SkillService.readSkill(id, userId);
			
			res.send(skill);
		} catch (err) {
			next(err);
		}
	}
	
	async search(req: Request, res: Response, next: NextFunction) {
		try {
			const {
				query,
				tags,
				authorIds,
				verifierIds,
				approvedDates,
				auditDates,
				limit,
				page
			} = req.query;
			
			const [newLimit, offset] = calcPageLimitAndOffset(limit, page)
			
			const decodedQuery = decodeURIComponent(query as string);
			
			const tagsArray = parseQueryArray(tags as string);
			const authorIdsArray = parseQueryArray(authorIds as string);
			const verifierIdsArray = parseQueryArray(verifierIds as string);
			
			const approvedDatesArray = parseQueryDates(approvedDates as string);
			const auditDatesArray = parseQueryDates(auditDates as string);
			
			const skills = await SkillService.search(
				decodedQuery,
				newLimit,
				offset,
				tagsArray,
				authorIdsArray,
				verifierIdsArray,
				approvedDatesArray,
				auditDatesArray,
			);
			
			res.send(skills);
			
		} catch (err) {
			next(err);
		}
	}
	
	async getAllUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			
			const users = await SkillService.getAllUsers(id);
			
			res.send(users);
		} catch (err) {
			next(err);
		}
	}
	
	async createVersion(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			
			const {
				fileId ,
				authorId,
				verifierid,
			} = req.body;
			
			const skillVersion = await SkillService.createVersion(id, fileId , authorId, verifierid);
			
			res.send(skillVersion);
		} catch (err) {
			next(err);
		}
	}
	
	async getVersion(req: Request, res: Response, next: NextFunction) {
		try {
			const { versionId } = req.params;
			
			const skillVersion = await SkillService.getVersion(versionId);
			
			res.send(skillVersion);
		} catch (err) {
			next(err);
		}
	}
	
	async getVersions(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			
			const skillVersions = await SkillService.getVersions(id);
			
			res.send(skillVersions);
			
		} catch (err) {
			next(err);
		}
	}
	
	async deleteVersion(req: Request, res: Response, next: NextFunction) {
		try {
			const { versionId } = req.params;
			
			await SkillService.deleteVersion(versionId);
			
			res.status(204).send();
			
		} catch (err) {
			next(err);
		}
	}
	
	async addTag(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			
			const { tagId } = req.body;
			
			await SkillService.addTag(id, tagId);
			
			res.status(204).send();
			
		} catch (err) {
			next(err);
		}
	}
	
	async deleteTag(req: Request, res: Response, next: NextFunction) {
		try {
			const { id, tagId } = req.params;
			
			await SkillService.deleteTag(id, tagId);
			
			res.status(204).send();
			
		} catch (err) {
			next(err);
		}
	}
	
	async getTags(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			
			await SkillService.getTags(id);
			
			res.status(204).send();
			
		} catch (err) {
			next(err);
		}
	}
}

export default new SkillController();
