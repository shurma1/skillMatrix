import { Op, fn, col, where } from 'sequelize';
import JobRole, { JobRoleInstance } from '../models/entities/JobRole';
import {JobRoleToSkills, Skill, Tag, User, UserToJobRole} from "../models";
import {UserInstance} from "../models/entities/User";
import {SkillInstance} from "../models/entities/Skill";
import {TagInstance} from "../models/entities/Tag";

class JobRoleRepository {
	async create(title: string): Promise<JobRoleInstance> {
		return await JobRole.create({ title });
	}

	async update(id: string, title?: string): Promise<JobRoleInstance | false> {
		const jobRole = await this.getByID(id);
		if (!jobRole) return false;
		if (title !== undefined) jobRole.title = title;
		await jobRole.save();
		return jobRole;
	}

	async getByID(id: string): Promise<JobRoleInstance | null> {
		return await JobRole.findOne({ where: { id } });
	}
	
	async getByTitle(title: string): Promise<JobRoleInstance | null> {
		return await JobRole.findOne({ where: { title } });
	}

	async search(query: string, limit: number, offset: number) {
		return await JobRole.findAndCountAll({
			where: {
				[Op.and]: [
					where(
						fn('lower', col('title')),
						{
							[Op.like]: `%${query.toLowerCase()}%`
						}
					)
				]
			},
			limit,
			offset
		});
	}

	async delete(id: string): Promise<boolean> {
		const deletedCount = await JobRole.destroy({ where: { id } });
		return deletedCount > 0;
	}
	
	
	async getUsers(jobId: string) {
		return await JobRole.findOne({
			where: {
				id: jobId
			},
			include: {
				model: User,
				attributes: ['id', 'login', 'firstname', 'lastname', 'patronymic'],
				through: {
					attributes: ['createdAt']
				}
			},
			
		}) as (JobRoleInstance & {users: (UserInstance & {userToJobRole: {createdAt: Date}})[]});
	}
	
	async getUser(jobId: string, userId: string) {
		return await JobRole.findOne({
			where: {
				id: jobId
			},
			include: {
				model: User,
				attributes: ['id', 'login', 'firstname', 'lastname', 'patronymic'],
				through: {
					attributes: ['createdAt']
				},
				where: {
					id: userId
				}
			},
			
		}) as (JobRoleInstance & {users: (UserInstance & {userToJobRole: {createdAt: Date}})[]});
	}
	
	async addUser(jobId: string, userId: string) {
		return await UserToJobRole.create({jobRoleId: jobId, userId});
	}
	
	async deleteUser(jobId: string, userId: string) {
		const deletedCount = await UserToJobRole.destroy({ where: { jobRoleId: jobId, userId } });
		return deletedCount > 0;
	}
	
	async addSkill(jobId: string, skillId: string, targetLevel: number) {
		const jobToSkill = await JobRoleToSkills.create({jobRoleId: jobId, skillId, targetLevel});
		return jobToSkill;
	}
	
	async updateSkill(jobId: string, skillId: string, targetLevel: number) {
		const jobToSkill = await JobRoleToSkills.findOne({
			where: {
				jobRoleId: jobId,
				skillId
			}
		});
		
		if(! jobToSkill) {
			return null;
		}
		
		jobToSkill.targetLevel = targetLevel;
		
		await jobToSkill.save();
		
		return jobToSkill;
	}
	
	async getSkill(jobId: string, skillId: string) {
		
		const jobRoleToSkill = await JobRoleToSkills.findOne({
			where: {
				jobRoleId: jobId,
				skillId
			}
		});
		
		const skill = await Skill.findOne({
			where: {id: skillId},
			include: {
				model: Tag,
			}
		}) as SkillInstance & {tags: TagInstance[]};
		
		const result = {
			jobRoleToSkill,
			skill
		};
		
		return result;
	}
	
	async getJobSkill(jobId: string, skillId: string) {
		
		const jobRoleToSkill = await JobRoleToSkills.findOne({
			where: {
				jobRoleId: jobId,
				skillId
			}
		});
		
		return jobRoleToSkill;
	}
	
	async getJobSkills(jobId: string) {
		const jobRolesWithSkills = await JobRole.findOne({
			where: { id: jobId },
			
			include: [{
				model: Skill,
				through: {
					// @ts-ignore
					model: JobRoleToSkills,
					attributes: ['targetLevel']
				},
				include: [{
					model: Tag
				}]
			}]
		}) as JobRoleInstance & {
			skills: (SkillInstance & {
				jobRoleToSkills: { targetLevel: number },
				tags: TagInstance[]
			})[]
		};
		
		return jobRolesWithSkills;
	}
	
	async deleteSkill(jobId: string, skillId: string) {
		const deletedCount = await JobRoleToSkills.destroy({ where: { jobRoleId: jobId, skillId } });
		return deletedCount > 0;
	}
}

export default new JobRoleRepository();
