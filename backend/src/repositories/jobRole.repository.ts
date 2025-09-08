import { Op, fn, col, where, QueryTypes } from 'sequelize';
import JobRole, { JobRoleInstance } from '../models/entities/JobRole';
import {JobRoleToSkills, Skill, Tag, User, UserToJobRole, Sequelize, SkillVersion} from "../models";
import {loadSql} from "../utils/loadSql";
import {UserInstance} from "../models/entities/User";
import {SkillInstance} from "../models/entities/Skill";
import {TagInstance} from "../models/entities/Tag";
import {SkillVersionInstance} from "../models/entities/SkillVersion";

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
		// If query is empty or not a string, return all job roles with pagination.
		if (typeof query !== 'string' || query.trim() === '') {
			return await JobRole.findAndCountAll({
				limit,
				offset
			});
		}

		const q = query.toLowerCase();
		return await JobRole.findAndCountAll({
			where: {
				[Op.and]: [
					where(
						fn('lower', col('title')),
						{
							[Op.like]: `%${q}%`
						}
					)
				]
			},
			limit,
			offset
		});
	}
	
	async getAllByUserId(userId: string) {
		return await JobRole.findAll({
			include: [{
				model: User,
				where: { id: userId },
				through: { attributes: [] }
			}]
		});
	}
	
	async getAll() {
		return await JobRole.findAll();
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
	
	async isUserHasJobrole(jobId: string, userId: string) {
		return !! await UserToJobRole.findOne({where: {jobRoleId: jobId, userId}});
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
					// @ts-expect-error Sequelize typing issue with through attributes
					model: JobRoleToSkills,
					attributes: ['targetLevel']
				},
				include: [{
					model: Tag
				},
				{
					model: SkillVersion,
					separate: true,
					limit: 1,
					order: [['version', 'DESC']]
				}]
			}]
		}) as JobRoleInstance & {
			skills: (SkillInstance & {
				jobRoleToSkills: { targetLevel: number },
				tags: TagInstance[],
				skillVersions: SkillVersionInstance[]
			})[]
		};
		
		return jobRolesWithSkills;
	}
	
	async getEmployeesCount(jobRoleId: string) {
		return await UserToJobRole.count({where: {jobRoleId}});
	}
	
	async deleteSkill(jobId: string, skillId: string) {
		const deletedCount = await JobRoleToSkills.destroy({ where: { jobRoleId: jobId, skillId } });
		return deletedCount > 0;
	}
	
	async getTargetGeneralLevel(jobRoleId: string) {
		const records = await JobRoleToSkills.findAll({
			where: { jobRoleId },
			include: [{
				model: Skill,
				where: { isActive: true }
			}],
		});
		
		const total = records.reduce((sum, record) => sum + record.targetLevel, 0);
		return total;
	}
	
	async getEmployeeCurrentLevel(jobRoleId: string) {
		const sql = loadSql('get_employee_current_level_by_jobrole');
		const row = await Sequelize.query<{ totallevel: number | string | null }>(
			sql,
			{ replacements: { jobRoleId }, type: QueryTypes.SELECT, plain: true }
		);
		
		return Number(row?.totallevel || 0);
	}
	
	async getUsersBySkillId(skillId: string) {
		const skill = await Skill.findOne({
			where: { id: skillId },
			include: [
				{
					model: JobRole,
					include: [
						{
							model: User
						}
					]
				}
			]
		}) as SkillInstance & {jobRoles: (JobRoleInstance & {users: UserInstance[] | null})[] | null} | null;
		
		return skill?.jobRoles?.flatMap(jobRole => jobRole.users || []) || [];
	}

	async getEmployeeLevels(jobRoleId: string): Promise<{ userId: string; level: number }[]> {
		const sql = loadSql('get_employee_levels_by_jobrole');
		const rows = await Sequelize.query<{ userId: string; level: number | string }>(
			sql,
			{ replacements: { jobRoleId }, type: QueryTypes.SELECT }
		);
		return rows.map(r => ({ userId: r.userId, level: Number(r.level ?? 0) }));
	}
	
	
	async getLevelMatrixBySkills(skillIds: string[], jobRoleIds: string[]) {
		const sql = loadSql('get_level_matrix_by_skills');
		const rows = await Sequelize.query<{ skillId: string; jobRoleId: string; targetLevel: number }>(
			sql,
			{
				replacements: {
					jobRoleIds,
					skillIds,
				},
				type: QueryTypes.SELECT
			}
		);
		
		const matrix: number[][] = [];
		
		for (let i = 0; i < skillIds.length; i++) {
			matrix[i] = [];
			for (let j = 0; j < jobRoleIds.length; j++) {
				const row = rows.find(r =>
					r.skillId === skillIds[i] && r.jobRoleId === jobRoleIds[j]
				);
				matrix[i][j] = row ? row.targetLevel : 0;
			}
		}
		
		return matrix;
	}
	
}

export default new JobRoleRepository();
