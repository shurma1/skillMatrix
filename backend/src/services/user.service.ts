import {UserInstance} from '../models/entities/User';
import bcrypt from 'bcrypt';
import {ApiError} from "../error/apiError";
import ImageRepository from '../repositories/image.repository';
import {validate as isValidUUID} from 'uuid';
import {UserDTO} from "../dtos/user.dto";
import {PaginationDTO} from "../dtos/Pagination.dto";
import UserRepository, {UserSkillSearch} from "../repositories/user.repossitory";
import UserRepossitory from "../repositories/user.repossitory";
import {UserSkillDto} from "../dtos/userSkill.dto";
import SkillRepository from "../repositories/skill.repository";
import {ConfirmationDTO} from "../dtos/confirmation.dto";
import {UserSkillSearchDto} from "../dtos/userSkillSearch.dto";
import {UserJobRoleSearchDTO} from "../dtos/userJobRoleSearch.dto";
import JobRoleRepository from "../repositories/jobRole.repository";
import {JobRoleInstance} from "../models/entities/JobRole";
import {SkillConfirmType} from "../models/types/SkillConfirmType";
import {loadSql} from "../utils/loadSql";
import {Sequelize} from "../models";
import {QueryTypes} from "sequelize";


class UserService {
	async create(data: {
		login: string;
		firstname: string;
		lastname: string;
		patronymic: string;
		password: string;
		email?: string,
		avatar_id?: string,
  }): Promise<UserDTO> {
		
		const user = await UserRepository.getByLogin(data.login);
		
		if(user) {
			throw ApiError.errorByType('USER_ALREADY_EXISTS');
		}
		
		if(data.password.length < 8 || data.password.length > 100) {
			throw ApiError.errorByType('INVALID_PASSWORD_LENGTH');
		}
		
		if(data.avatar_id) {
			if(! isValidUUID(data.avatar_id)) {
				throw ApiError.errorByType('INVALID_UUID');
			}
			
			const image = await ImageRepository.getByID(data.avatar_id)
			
			if(! image) {
				throw ApiError.errorByType('IMAGE_NOT_FOUND');
			}
		}
		
		const hashPassword = await bcrypt.hash(data.password, 5);
		
		const createdUser = await UserRepository.create(
			data.login,
			data.firstname,
			data.lastname,
			data.patronymic,
			hashPassword,
			data.email,
			data.avatar_id
		);
		
		return this.instanceToUserDTO(createdUser);
	}

	async update(id: string, data: {
		login: string;
		firstname: string;
		lastname: string;
		patronymic: string;
		password: string;
		email: string,
		avatar_id: string | null,
	}): Promise<UserDTO> {
		
		await this.checkIsUserExist(id);
		
		const newPassword = (data.password ? bcrypt.hashSync(data.password, 5) : undefined);
		
		const updatedUser = await UserRepository.update(
			id,
			data.login,
			data.firstname,
			data.lastname,
			data.patronymic,
			newPassword,
			data.avatar_id,
			data.email
		) as UserInstance;
		
		return this.instanceToUserDTO(updatedUser);
	}
	
	async getAll() {
		const users = await UserRepository.getAll();
		
		return users.map(user => new UserDTO(user.id, user.login, user.firstname, user.lastname, user.patronymic, user.avatar_id, user.email));
	}

	async getByID(id: string): Promise<UserDTO> {
		const user =  await UserRepository.getByID(id);
		
		if(! user) {
			throw ApiError.errorByType('USER_NOT_FOUND');
		}
		
		return this.instanceToUserDTO(user);
	}
	
	async checkIsUserExist(id: string): Promise<UserInstance> {
		const user =  await UserRepository.getByID(id);
		
		if(! user) {
			throw ApiError.errorByType('USER_NOT_FOUND');
		}
		return user;
	}
	
	async checkIsSkillExist(id: string): Promise<void> {
		const skill =  await SkillRepository.getByID(id);
		
		if(! skill) {
			throw ApiError.errorByType('SKILL_NOT_FOUND');
		}
	}
	
	private async checkIsJobroleExist(id: string): Promise<void> {
		const jobrole =  await JobRoleRepository.getByID(id);
		
		if(! jobrole) {
			throw ApiError.errorByType('JOBROLE_NOT_FOUND');
		}
	}

	async search(query: string, limit: number, offset: number): Promise<PaginationDTO<UserDTO>> {
		const userWithCount = await UserRepository.search(query, limit, offset);
		
		return new PaginationDTO(
			userWithCount.count,
			userWithCount.rows.map(this.instanceToUserDTO)
		);
	}

	async delete(id: string): Promise<boolean> {
		await this.checkIsUserExist(id);
		return await UserRepository.delete(id);
	}
	
	async getAllSkills(userId: string): Promise<UserSkillSearchDto[]> {
		await this.checkIsUserExist(userId);
		
		return await UserRepository.getAllSkills(userId) as UserSkillSearchDto[];
	}
	
	async getAllSkillsByJobrole(userId: string, jobroleId: string): Promise<UserSkillSearchDto[]> {
		await this.checkIsUserExist(userId);
		await this.checkIsJobroleExist(jobroleId);
		
		return await UserRepository.getAllSkillsByJobroles(userId, jobroleId) as UserSkillSearchDto[];
	}
	
	async addSkill(userId: string, skillId: string, targetLevel: number) {
		await this.checkIsUserExist(userId);
		await this.checkIsSkillExist(skillId);
		
		const isUserSkillExist = !! await UserRepossitory.getUserSkillByUserAndSkillIds(userId, skillId);
		
		if(isUserSkillExist) {
			throw ApiError.errorByType('USER_ALREADY_HAS_THIS_SKILL')
		}
		
		const userSkill = await UserRepository.addSkill(userId, skillId, targetLevel);
		
		return this.getSkill(userSkill.userId, userSkill.skillId);
	}
	
	async updateSkill(userId: string, skillId: string, targetLevel: number) {
		await this.checkIsUserExist(userId);
		await this.checkIsSkillExist(skillId);
		
		const isUserSkillExist = !! await UserRepossitory.getUserSkillByUserAndSkillIds(userId, skillId);
		
		if(! isUserSkillExist) {
			throw ApiError.errorByType('USER_HAS_NOT_THIS_SKILL')
		}
		
		await UserRepository.updateSkill(userId, skillId, targetLevel);
		
		const userSkill = await this.getSkill(userId, skillId);
		
		return userSkill;
	}
	
	async getSkill(userId: string, skillId: string) {
		await this.checkIsUserExist(userId);
		await this.checkIsSkillExist(skillId);
		
		const userSkill = await UserRepository.getSkill(userId, skillId);
		
		if(! userSkill) {
			throw ApiError.errorByType('USER_HAS_NOT_THIS_SKILL')
		}
		
		return userSkill as UserSkillDto;
	}
	async deleteSkill(userId: string, skillId: string) {
		await this.checkIsUserExist(userId);
		await this.checkIsSkillExist(skillId);
		
		return  await UserRepository.deleteSkill(userId, skillId);
	}
	
	async getAllJobroles(userId: string) {
		await this.checkIsUserExist(userId);
		
		const userJobroles = await UserRepository.getJobRoles(userId);
		
		return userJobroles.map(jobrole => new UserJobRoleSearchDTO(jobrole.id, jobrole.title, new Date(jobrole.userToJobRole.createdAt!)))
	}
	
	async addJobrole(userId: string, jobroleId: string) {
		await this.checkIsUserExist(userId);
		await this.checkIsJobroleExist(jobroleId);
		
		const isJobroleExistInThisUser = !! await UserRepossitory.getJobRoleByUserAndJobroleIds(userId, jobroleId);
		
		if(isJobroleExistInThisUser) {
			throw ApiError.errorByType('USER_ALREADY_HAS_THIS_JOBROLE')
		}
		
		const userJobrole = await UserRepository.addJobRole(userId, jobroleId);
		
		if(!userJobrole) {
			throw ApiError.errorByType('JOBROLE_NOT_FOUND')
		}
		
		const jobRole = await JobRoleRepository.getByID(jobroleId) as JobRoleInstance;
		
		return new UserJobRoleSearchDTO(jobRole.id, jobRole.title, userJobrole.createdAt!)
		
	}
	
	async deleteJobrole(userId: string, jobroleId: string) {
		await this.checkIsUserExist(userId);
		await this.checkIsJobroleExist(jobroleId);
		
		return await UserRepository.deleteJobRole(userId, jobroleId);
	}
	
	async addConfirmation(
		userId: string,
		skillId: string,
		type: string,
		level: number
	) {
		await this.checkIsUserExist(userId);
		await this.checkIsSkillExist(skillId);
		
		const lastVersion = await SkillRepository.getLastVersion(skillId);
		
		if(! lastVersion) {
			throw ApiError.errorByType('SKILL_VERSION_NOT_FOUND');
		}
		
		if(
			type !== SkillConfirmType.Acquired
			&& type !== SkillConfirmType.Debuff
			&& type != SkillConfirmType.AdminSet
		) {
			throw ApiError.errorByType('INVALID_CONFIRM_TYPE');
		}
		
		const nowDate = new Date(Date.now());
		
		const confirmation = await UserRepository.addConfirmation(userId, skillId, type, level, nowDate, lastVersion.version);
		
		return new ConfirmationDTO(confirmation.id, confirmation.type, confirmation.level, confirmation.date, confirmation.version);
	}
	
	async getConfirmations(
		userId: string,
		skillId: string,
	) {
		await this.checkIsUserExist(userId);
		await this.checkIsSkillExist(skillId);
		
		const confirmations = await UserRepository.getConfirmations(userId, skillId);
		
		return confirmations.map(confirmation => new ConfirmationDTO(confirmation.id, confirmation.type, confirmation.level, confirmation.date, confirmation.version))
	}
	
	// calculateCurrentConfirmationLevel(confirmations: ConfirmationDTO[]) {
	// 	let level = 0;
	// 	let mayRestore = false;
	// 	let maxLevel = 0;
	//
	// 	confirmations.reverse().forEach(confirmation => {
	// 		switch (confirmation.type) {
	// 		case SkillConfirmType.AdminSet: {
	// 			mayRestore = false;
	//
	// 			maxLevel = confirmation.level;
	// 			level = confirmation.level;
	// 			break;
	// 		}
	// 		case SkillConfirmType.Debuff: {
	// 			mayRestore = true;
	// 			level = confirmation.level;
	// 			break;
	// 		}
	// 		case SkillConfirmType.Acquired: {
	// 			if(mayRestore) {
	// 				level = Math.max(confirmation.level, maxLevel);
	// 				mayRestore = false;
	// 			}
	// 			else {
	// 				level = confirmation.level;
	// 			}
	//
	// 			break;
	// 		}
	// 		}
	//
	// 		if(level > maxLevel) maxLevel = level;
	// 	})
	//
	// 	return level;
	// }
	
	async deleteConfirmations(
		userId: string,
		skillId: string,
		confirmationId: string
	) {
		await this.checkIsUserExist(userId);
		await this.checkIsSkillExist(skillId);
		
		const confirmations = await UserRepository.deleteConfirmation(confirmationId);
		
		return confirmations;
	}
	
	async getResultPreview(query: string) {
		
		const result = await UserRepossitory.getResultPreview(query);
		console.log('result', result)
		return result;
	}
	
	private instanceToUserDTO(user: UserInstance): UserDTO {
		return new UserDTO(
			user.id,
			user.login,
			user.firstname,
			user.lastname,
			user.patronymic,
			user.avatar_id,
			user.email,
		);
	}
}

export default new UserService();
