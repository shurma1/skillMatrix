import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import { ApiError } from '../error/apiError';
import calcPageLimitAndOffset from "../utils/calcPageLimitAndOffset";

class UserController {
	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const {
				login,
				firstname,
				lastname,
				patronymic,
				password,
				email,
				avatar_id
			} = req.body;
			
			const user = await UserService.create({
				login,
				firstname,
				lastname,
				patronymic,
				password,
				email,
				avatar_id
			});
			
			res.status(201).json(user);
		} catch (err) {
			next(err);
		}
	}

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			
			const {
				login,
				firstname,
				lastname,
				patronymic,
				password,
				email,
				avatar_id
			} = req.body;
			
			const user = await UserService.update(
				id,
				{
					login,
					firstname,
					lastname,
					patronymic,
					password,
					email,
					avatar_id
				}
			);
			
			res.json(user);
		} catch (err) {
			next(err);
		}
	}

	async getByID(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const user = await UserService.getByID(id);
			
			res.json(user);
		} catch (err) {
			next(err);
		}
	}

	async search(req: Request, res: Response, next: NextFunction) {
		try {
			const { query, limit, page } = req.query;
			const decodedQuery = decodeURIComponent(query as string);
			
			const [newLimit, offset] = calcPageLimitAndOffset(limit, page)
			
			const users = await UserService.search(decodedQuery, newLimit, offset);
			//const userDTOs = users.map(user => new UserDTO(user.id, user.login, user.firstname, user.lastname, user.patronymic, user.avatar_id, user.email));
			res.json(users);
		} catch (err) {
			next(err);
		}
	}

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const deleted = await UserService.delete(id);
			if (!deleted) throw ApiError.errorByType('USER_NOT_FOUND');
			res.status(204).send();
		} catch (err) {
			next(err);
		}
	}
	
	
	
	async getAllSkills(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
	
			const skills = await UserService.getAllSkills(id);
			
			res.json(skills);
		} catch (err) {
			next(err);
		}
	}
	
	async getSkill(req: Request, res: Response, next: NextFunction) {
		try {
			const { id, skillId } = req.params;
			
			const userSkill = await UserService.getSkill(id, skillId);
			
			res.json(userSkill);
		} catch (err) {
			next(err);
		}
	}
	
	async addSkill(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const {
				skillId,
				targetLevel
			} = req.body;
			
			const userSkill = await UserService.addSkill(id, skillId, targetLevel);
			
			res.json(userSkill);
		} catch (err) {
			next(err);
		}
	}
	
	async updateSkill(req: Request, res: Response, next: NextFunction) {
		try {
			const { id, skillId } = req.params;
			const {
				targetLevel
			} = req.body;
			
			const userSkill = await UserService.updateSkill(id, skillId, targetLevel);
			
			res.json(userSkill);
		} catch (err) {
			next(err);
		}
	}
	
	async deleteSkill(req: Request, res: Response, next: NextFunction) {
		try {
			const { id, skillId } = req.params;
			const deleted = await UserService.deleteSkill(id, skillId);
			if (!deleted) throw ApiError.errorByType('USER_HAS_NOT_THIS_SKILL');
			res.status(204).send();
		} catch (err) {
			next(err);
		}
	}
	
	async getAllJobRoles(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			
			const jobroles = await UserService.getAllJobroles(id);
			
			res.json(jobroles);
		} catch (err) {
			next(err);
		}
	}
	
	async getAllSkillsByJobrole(req: Request, res: Response, next: NextFunction) {
		try {
			const { id, jobroleId } = req.params;
			
			const skills = await UserService.getAllSkillsByJobrole(id, jobroleId);
			
			res.json(skills);
		} catch (err) {
			next(err);
		}
	}
	
	async addJobrole(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const { jobRoleId } = req.body;
			
			const jobRole = await UserService.addJobrole(id, jobRoleId);
			
			res.json(jobRole);
		} catch (err) {
			next(err);
		}
	}
	
	async deleteJobrole(req: Request, res: Response, next: NextFunction) {
		try {
			const { id, jobroleId } = req.params;
			
			await UserService.deleteJobrole(id, jobroleId);
			
			res.status(204).send();
		} catch (err) {
			next(err);
		}
	}
	
	
	async addConfirmation(req: Request, res: Response, next: NextFunction) {
		try {
			const { id, skillId } = req.params;
			
			const { type, level, version } = req.body;
			
			const confirmation = await UserService.addConfirmation(id, skillId, type, level, version);
			
			res.json(confirmation);
		} catch (err) {
			next(err);
		}
	}
	
	async getConfirmations(req: Request, res: Response, next: NextFunction) {
		try {
			const { id, skillId } = req.params;
			
			const confirmations = await UserService.getConfirmations(id, skillId);
			
			res.json(confirmations);
		} catch (err) {
			next(err);
		}
	}
	
	async deleteConfirmation(req: Request, res: Response, next: NextFunction) {
		try {
			const { id, skillId, confirmationId } = req.params;
			await UserService.deleteConfirmations(id, skillId, confirmationId);
			
			res.status(204).send();
			
		} catch (err) {
			next(err);
		}
	}
}

export default new UserController();
