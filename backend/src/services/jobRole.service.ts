import JobRoleRepository from '../repositories/jobRole.repository';
import { JobRoleInstance } from '../models/entities/JobRole';
import {ApiError} from "../error/apiError";
import {JobRoleDTO} from "../dtos/jobRole.dto";
import {PaginationDTO} from "../dtos/Pagination.dto";
import {JobRoleSearchDTO} from "../dtos/jobRoleSearch.dto";
import {JobRoleUserSearchDTO} from "../dtos/jobRoleUserSearch.dto";
import UserService from "./user.service";
import {JobRoleSkillSearchDTO} from "../dtos/jobRoleSkillSearch.dto";
import {TagSearchDTO} from "../dtos/tag.dto";
import SkillService from "./skill.service";
import {JobRoleToSkillsInstance} from "../models/entities/JobRoleToSkills";
import TestRepository from "../repositories/test.repository";

class JobRoleService {
	async create(data: { title: string }): Promise<JobRoleDTO> {
		const jobRole = await JobRoleRepository.getByTitle(data.title);
		
		if(jobRole) {
			throw ApiError.errorByType('JOB_ALREADY_EXIST');
		}
		
		const createdJobRole = await JobRoleRepository.create(data.title);
		
		return this.instanceToJobRoleDTO(createdJobRole);
	}

	async update(id: string, data: { title?: string }): Promise<JobRoleDTO> {
		await this.checkIsJobRoleExists(id);
		const updatedJobRole = await JobRoleRepository.update(id, data.title) as JobRoleInstance;
		
		return this.instanceToJobRoleDTO(updatedJobRole);
	}

	async getByID(id: string): Promise<JobRoleDTO> {
		await this.checkIsJobRoleExists(id);
		const jobRole = await JobRoleRepository.getByID(id) as JobRoleInstance;
		
		return this.instanceToJobRoleDTO(jobRole);
	}
	
	async search(query: string, limit: number, offset: number): Promise<PaginationDTO<JobRoleSearchDTO>> {
		const jobRolesWithCount = await JobRoleRepository.search(query, limit, offset);
		
		return new PaginationDTO<JobRoleSearchDTO>(
			jobRolesWithCount.count,
			jobRolesWithCount.rows.map(this.instanceToJobRoleSearchDTO)
		);
	}

	async delete(id: string): Promise<boolean> {
		return await JobRoleRepository.delete(id);
	}
	
	async getUsers(jobId: string) {
		const jobUsers = await JobRoleRepository.getUsers(jobId);
		
		return jobUsers.users.map(user =>
			new JobRoleUserSearchDTO(
				user.id,
				user.login,
				user.email || null,
				user.firstname,
				user.lastname,
				user.patronymic,
				user.avatar_id || null,
				user.userToJobRole.createdAt
			)
		)
	}
	
	async addUser(jobId: string, userId: string) {
		await this.checkIsJobRoleExists(jobId);
		await UserService.checkIsUserExist(userId);
		
		await JobRoleRepository.addUser(jobId, userId);
		
		const jobUser = await JobRoleRepository.getUser(jobId, userId);
		
		const user = jobUser.users[0];
		
		return new JobRoleUserSearchDTO(
			user.id,
			user.login,
			user.email || null,
			user.firstname,
			user.lastname,
			user.patronymic,
			user.avatar_id || null,
			user.userToJobRole.createdAt
		)
	}
	
	async deleteUser(jobId: string, userId: string) {
		return await JobRoleRepository.deleteUser(jobId, userId);
	}
	
	async addSkill(jobId: string, skillId: string, targetLevel: number) {
		await this.checkIsJobRoleExists(jobId);
		await SkillService.checkSkillExist(skillId);
		
		const isJobSkillExist = !! await JobRoleRepository.getJobSkill(jobId, skillId);
		
		if(isJobSkillExist) {
			throw ApiError.errorByType('JOB_ALREADY_HAS_THIS_SKILL');
		}
		
		const jobToSkill = await JobRoleRepository.addSkill(jobId, skillId, targetLevel);
		
		return this.getSkill(jobToSkill.jobRoleId, jobToSkill.skillId);
	}
	
	async updateSkill(jobId: string, skillId: string, targetLevel: number) {
		await this.checkIsJobRoleExists(jobId);
		await SkillService.checkSkillExist(skillId);
		
		const isJobSkillExist = !! await JobRoleRepository.getJobSkill(jobId, skillId);
		
		if(! isJobSkillExist) {
			throw ApiError.errorByType('JOB_ALREADY_HASNT_THIS_SKILL');
		}
		
		const jobToSkill = await JobRoleRepository.updateSkill(jobId, skillId, targetLevel) as JobRoleToSkillsInstance;
		
		return this.getSkill(jobToSkill.jobRoleId, jobToSkill.skillId);
	}
	
	async getSkill(jobId: string, skillId: string) {
		const jobSkill = await JobRoleRepository.getSkill(jobId, skillId);
		
		const testId = await TestRepository.getTestIdBySkill(skillId);
		
		return new JobRoleSkillSearchDTO(
			jobSkill.skill!.id,
			jobSkill.skill!.title,
			jobSkill.skill!.type,
			jobSkill.skill.tags.map(tag =>
				new TagSearchDTO(
					tag.id,
					tag.name
				)),
			jobSkill.jobRoleToSkill!.targetLevel,
			testId || undefined
		)
	}
	
	async checkIsJobRoleExists(id: string) {
		const jobRole = await JobRoleRepository.getByID(id);
		
		if(! jobRole) {
			throw ApiError.errorByType('JOBROLE_NOT_FOUND');
		}
	}
	
	async deleteSkill(jobId: string, skillId: string) {
		return await JobRoleRepository.deleteSkill(jobId, skillId);
	}
	
	async getSkills(jobId: string): Promise<JobRoleSkillSearchDTO[]> {
		const jobSkills = await JobRoleRepository.getJobSkills(jobId);
		
		const promises = jobSkills.skills.map(async skill =>
			new JobRoleSkillSearchDTO(
				skill.id,
				skill.title,
				skill.type,
				skill.tags.map(tag =>
					new TagSearchDTO(
						tag.id,
						tag.name,
					)
				),
				skill.jobRoleToSkills.targetLevel,
				await TestRepository.getTestIdBySkill(skill.id) || undefined
			)
		)
		
		return await Promise.all(promises);
	}
	
	private instanceToJobRoleDTO(instance: JobRoleInstance): JobRoleDTO {
		return new JobRoleDTO(instance.id, instance.title);
	}
	
	private instanceToJobRoleSearchDTO(instance: JobRoleInstance): JobRoleSearchDTO {
		return new JobRoleSearchDTO(instance.id, instance.title);
	}
}

export default new JobRoleService();
