import User, {UserInstance} from '../models/entities/User';
import {updateModel} from "../utils/updateModel";
import permissionRepository from "../repositories/permission.repository";
import userToPermission from "../models/entities/UserToPermission";
import jobRoleRepository from "./jobRole.repository";
import userToJobRole, {UserToJobRoleInstance} from "../models/entities/UserToJobRole";
import {Op, QueryTypes} from "sequelize";
import {JobRole, Sequelize, UserToConfirmSkills, UserToJobRole, UserToSkills} from "../models";
import {loadSql} from "../utils/loadSql";
import {SkillType} from "../models/types/SkillType";
import {SkillConfirmType} from "../models/types/SkillConfirmType";
import {JobRoleInstance} from "../models/entities/JobRole";
import {UserToConfirmSkillsInstance} from "../models/entities/UserToConfirmSkills";


export interface UserSkillSearch {
	skillId: string,
	title: string,
	type: SkillType,
	level: number,
	targetLevel: number,
	isConfirmed: boolean,
	isActive: boolean,
	isNew: boolean,
	tags: {
		id: string,
		name: string
	}[],
	userId: string;
	login: string;
	firstname: string;
	patronymic: string;
	testId?: string;

}

interface UserPreview {
	firstname: string;
	lastname: string;
	patronymic: string;
	percent: number;
	level: number;
	targetLevel: number;
	jobRoles: string;
}


interface UserSkill extends UserSkillSearch{
	confirmations: {
		id: string,
		type: SkillConfirmType,
		level: number,
		date: Date,
		version: number
	}[]
}

class UserRepository {
	async create(
		login: string,
		firstname: string,
		lastname: string,
		patronymic: string,
		password_hash: string,
		email?: string,
		avatar_id?: string,
	): Promise<UserInstance> {
		return await User.create({login, firstname, lastname, patronymic, password_hash, email, avatar_id});
	}
	
	async update(
		id: string,
		login?: string,
		firstname?: string,
		lastname?: string,
		patronymic?: string,
		password_hash?: string,
		avatar_id?: string | null,
		email?: string,
	): Promise<UserInstance | false> {
		const user = await this.getByID(id);
		
		if(! user) return false;
		
		updateModel(user, {login, firstname, lastname, patronymic, password_hash, avatar_id, email})
		
		await user.save();
		return user;
	}
	
	async getByID(id: string): Promise<UserInstance | null> {
		return await User.findOne({ where: { id } });
	}
	
	async getUserByEmail(email: string): Promise<UserInstance | null> {
		return await User.findOne({ where: { email } });
	}
	
	async getByLogin(login: string): Promise<UserInstance | null> {
		return await User.findOne({ where: { login } });
	}
	
	async search(query: string, limit?: number, offset?: number){
		const searchTerm = `%${query.toLowerCase()}%`;
		
		return await User.findAndCountAll({
			where: {
				[Op.or]: [
					Sequelize.literal(
						`LOWER(CONCAT("firstname", ' ', "lastname", ' ', "patronymic")) LIKE '${searchTerm}'`
					),
					{
						login: {
							[Op.like]: searchTerm
						}
					}
				]
			},
			limit,
			offset
		});
	}
	
	async getResultPreview(query: string) {
		const sql = loadSql('get_users_preview');
		
		return await Sequelize.query<UserPreview>(
			sql,
			{
				replacements: { query },
				type: QueryTypes.SELECT
			}
		);
		
	}
	
	async delete(id: string): Promise<boolean> {
		const deletedCount = await User.destroy({ where: { id } });
		return deletedCount > 0;
	}
	
	async getAllSkills(userId: string): Promise<UserSkillSearch[]> {
		
		const sql = loadSql('get_all_user_skills');
		
		return await Sequelize.query<UserSkillSearch>(
			sql,
			{
				replacements: { userId },
				type: QueryTypes.SELECT
			}
		);
	}
	
	async getAllSkillsByJobroles(userId: string, jobRoleId: string): Promise<UserSkillSearch[]> {
		const sql = loadSql('get_all_user_skills_by_jobrole');
		
		return await Sequelize.query<UserSkillSearch>(
			sql,
			{
				replacements: { userId, jobRoleId },
				type: QueryTypes.SELECT
			}
		);
	}
	
	async getUserSkillByUserAndSkillIds(userId: string, skillId: string) {
		return await UserToSkills.findOne({where: {userId, skillId}});
	}
	
	async addSkill(userId: string, skillId: string, targetLevel: number) {
		return await UserToSkills.create({userId, skillId, targetLevel, isIncludeInTarget: false});
	}
	
	async updateSkill(userId: string, skillId: string, targetLevel: number): Promise<boolean> {
		const userSkill = await UserToSkills.findOne({where: {userId, skillId}});
		
		if(!userSkill) return false;
		
		userSkill.targetLevel = targetLevel;
		
		await userSkill.save();
		
		return true;
	}
	
	async getSkill(userId: string, skillId: string): Promise<UserSkill | null> {
		const sql = loadSql('get_user_skill');
		
		const userSkill = await Sequelize.query<UserSkill>(
			sql,
			{
				replacements: { userId, skillId },
				type: QueryTypes.SELECT
			}
		);
		
		return userSkill[0] || null;
	}
	
	async deleteSkill(userId: string, skillId: string): Promise<boolean> {
		const deletedCount = await UserToSkills.destroy({ where: { userId, skillId } });
		return deletedCount > 0;
	}
	
	
	
	async getPermissions(userId: string) {
		return await userToPermission.findAll({where: {userId}})
	}
	
	async addPermission(userId: string, permissionId: string): Promise<boolean> {
		const user = await this.getByID(userId);
		const permission = await permissionRepository.getByID(permissionId);
		
		if (!user || !permission) {
			return false;
		}
		
		await userToPermission.create({userId, permissionId});
		return true;
	}
	
	async removePermission(userId: string, permissionId: string): Promise<boolean> {
		const user = await this.getByID(userId);
		const permission = await permissionRepository.getByID(permissionId);
		
		if (!user || !permission) {
			return false;
		}
		
		const deletedCount = await userToPermission.destroy({where: {userId, permissionId}});
		
		return deletedCount > 0;
	}
	
	async getJobRoles(userId: string) {
		const userData = await User.findAll({
			where: { id: userId },
			include: [
				{
					model: JobRole,
					as: 'jobRoles'
				}
			]
		});
		
		if(! userData.length) return [];
		
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		const jobRoles = userData[0]['jobRoles'] as (JobRoleInstance & {userToJobRole: UserToJobRoleInstance})[];
		
		return jobRoles;
	}
	
	async getJobRoleByUserAndJobroleIds(userId: string, jobRoleId: string): Promise<UserToJobRoleInstance | null> {
		return await UserToJobRole.findOne({where: {userId, jobRoleId}});
	}
	
	async addJobRole(userId: string, jobRoleId: string): Promise<null | UserToJobRoleInstance> {
		const user = await this.getByID(userId);
		const jobRole = await jobRoleRepository.getByID(jobRoleId);
		
		if (!user || !jobRole) {
			return null;
		}
		
		return await userToJobRole.create({userId, jobRoleId});
	}
	
	async deleteJobRole(userId: string, jobRoleId: string): Promise<boolean> {
		const user = await this.getByID(userId);
		const jobRole = await jobRoleRepository.getByID(jobRoleId);
		
		if (!user || !jobRole) {
			return false;
		}
		
		const deletedCount = await userToJobRole.destroy({where: {userId, jobRoleId}});
		
		return deletedCount > 0;
	}
	
	async addConfirmation(
		userId: string,
		skillId: string,
		type: SkillConfirmType,
		level: number,
		date: Date,
		version: number,
	): Promise<UserToConfirmSkillsInstance> {
		return await UserToConfirmSkills.create({userId, skillId, type, level, date, version})
	}
	
	async getAll() {
		return await User.findAll();
	}
	
	async getUserServicedSkills(userId: string) {
		const sql = loadSql('get_user_serviced_skills');
		return await Sequelize.query<{
			id: string,
			type: string,
			title: string,
			isActive: boolean,
			approvedDate: Date,
			auditDate: Date,
			authorId: string | null,
			verifierId: string,
			version: number,
			tags: { id: string; name: string }[],
			testId?: string | null,
			documentId?: string | null,
		}>(
			sql,
			{
				replacements: { userId },
				type: QueryTypes.SELECT
			}
		);
	}
	
	async getConfirmations(
		userId: string,
		skillId: string,
	): Promise<UserToConfirmSkillsInstance[]> {
		return await UserToConfirmSkills.findAll({
			where: { userId, skillId },
			order: [['date', 'DESC']]
		});
	}
	
	async deleteConfirmation(
		confirmationId: string,
	): Promise<boolean> {
		return await UserToConfirmSkills.destroy({
			where: { id: confirmationId }
		}) > 0;
	}
}

export default new UserRepository();
