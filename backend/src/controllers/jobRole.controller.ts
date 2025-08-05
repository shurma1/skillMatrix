import { Request, Response, NextFunction } from 'express';
import JobRoleService from '../services/jobRole.service';
import { JobRoleDTO } from '../dtos/jobRole.dto';
import { ApiError } from '../error/apiError';
import calcPageLimitAndOffset from "../utils/calcPageLimitAndOffset";

class JobRoleController {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const { title } = req.body;
			const jobRole = await JobRoleService.create({ title });
			const jobRoleDTO = new JobRoleDTO(jobRole.id, jobRole.title);
			res.status(201).json(jobRoleDTO);
		} catch (err) {
			next(err);
		}
	}

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const jobRole = await JobRoleService.update(id, req.body);
			if (!jobRole) throw ApiError.errorByType('JOBROLE_NOT_FOUND');
			const jobRoleDTO = new JobRoleDTO(jobRole.id, jobRole.title);
			res.json(jobRoleDTO);
		} catch (err) {
			next(err);
		}
	}

	async getByID(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const jobRole = await JobRoleService.getByID(id);
			if (!jobRole) throw ApiError.errorByType('JOBROLE_NOT_FOUND');
			const jobRoleDTO = new JobRoleDTO(jobRole.id, jobRole.title);
			res.json(jobRoleDTO);
		} catch (err) {
			next(err);
		}
	}

	async search(req: Request, res: Response, next: NextFunction) {
		try {
			const { query, limit, page } = req.query;
			const decodedQuery = decodeURIComponent(query as string);
			
			const [newLimit, offset] = calcPageLimitAndOffset(limit, page)
			
			const jobRoles = await JobRoleService.search(decodedQuery, newLimit, offset);
			res.json(jobRoles);
		} catch (err) {
			next(err);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const deleted = await JobRoleService.delete(id);
			if (!deleted) throw ApiError.errorByType('JOBROLE_NOT_FOUND');
			res.status(204).send();
		} catch (err) {
			next(err);
		}
	}
	
	async getUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			
			const users = await JobRoleService.getUsers(id);
			
			res.send(users);
		} catch (err) {
			next(err);
		}
	}
	
	async addUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const { userId } = req.body;
			
			const jobUser = await JobRoleService.addUser(id, userId);
			
			res.send(jobUser);
		} catch (err) {
			next(err);
		}
	}
	
	async deleteUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { id, userId } = req.params;
			await JobRoleService.deleteUser(id, userId);
			
			res.status(204).send();
		} catch (err) {
			next(err);
		}
	}
	
	async getSkills(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			
			const skills = await JobRoleService.getSkills(id);
			
			res.send(skills);
		} catch (err) {
			next(err);
		}
	}
	
	async addSkill(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			
			const { skillId, targetLevel } = req.body;

			const jobSkill = await JobRoleService.addSkill(id, skillId, targetLevel);

			res.send(jobSkill);
		} catch (err) {
			next(err);
		}
	}
	
	async updateSkill(req: Request, res: Response, next: NextFunction) {
		try {
			const { id, skillId } = req.params;
			
			const { targetLevel } = req.body;
			
			const jobSkill = await JobRoleService.updateSkill(id, skillId, targetLevel);
			
			res.send(jobSkill);
		} catch (err) {
			next(err);
		}
	}
	
	async deleteSkill(req: Request, res: Response, next: NextFunction) {
		try {
			const { id, skillId } = req.params;
			
			await JobRoleService.deleteSkill(id, skillId);
			
			res.status(204).send();
		} catch (err) {
			next(err);
		}
	}
}

export default new JobRoleController();
