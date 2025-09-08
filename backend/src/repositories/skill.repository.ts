import {SkillInstance} from '../models/entities/Skill';
import {TagInstance} from '../models/entities/Tag';
import {SkillType} from "../dtos/skillWithCurrentVersion.dto";
import {updateModel} from "../utils/updateModel";
import {
	SkillVersion,
	TagToSkill,
	Tag,
	Skill,
	File,
	FileToSkillVersion,
	UserSkillView,
	UserToConfirmSkills, Test
} from "../models";
import {SkillVersionInstance} from "../models/entities/SkillVersion";
import {loadSql} from "../utils/loadSql";
import {Sequelize} from '../models/index';
import {QueryTypes} from "sequelize";
import {getDateRange} from "../utils/getDateRange";
import {UserSkillSearch} from "./user.repossitory";
import {FileInstance} from "../models/entities/File";
import TestRepository from "./test.repository";
import user from "../models/entities/User";
import SkillService from "../services/skill.service";
import {ApiError} from "../error/apiError";

export interface SkillWithTagsInstance extends SkillInstance {
	tags: TagInstance[];
}

export interface UserSkillsWithAuthorAndVerifier extends UserSkillSearch {
	verifierId: string;
	authorId: string | null;
	documentId?: string;
	version: number;
	approvedDate: Date,
	auditDate: Date
}

export interface UserSkillMatrixResult {
	skillId: string;
	userId: string;
	level: number;
}

export interface UsersBySkillResult {
	userId: string;
	login: string;
	firstname: string;
	lastname: string;
	patronymic: string | null;
	targetLevel: number;
	currentLevel: number;
	relationshipTypes: string;
}

export interface SkillsByUserResult {
	skillId: string;
	title: string;
	documentId: string | null;
	targetLevel: number;
	currentLevel: number;
	verifierId: string;
	authorId: string | null;
	version: number;
	approvedDate: Date;
	auditDate: Date;
	verifierFirstname: string;
	verifierLastname: string;
	authorFirstname: string | null;
	authorLastname: string | null;
}

export interface SkillCreation {
	type: SkillType;
	title: string;
	approvedDate: Date;
	auditDate: Date;
	verifierId: string;
	authorId: string | null;
	isActive: boolean;
	documentId?: string;
	fileId?: string
}

interface TagType {
	id: string,
	name: string,
}

export interface SkillWithVersion extends SkillCreation{
	id: string,
	version: number,
	tags: TagType[],
	testId?: string,
}

class SkillRepository {
	async create(skillData: SkillCreation): Promise<SkillWithVersion> {
		const skill = await Skill.create({
			type: skillData.type,
			title: skillData.title,
			isActive: skillData.isActive,
			documentId: skillData.documentId || undefined
		});
		
		const skillVersion = await SkillVersion.create({
			skillId: skill.id,
			authorId: skillData.authorId,
			verifierId: skillData.verifierId,
			approvedDate: skillData.approvedDate,
			auditDate: skillData.auditDate,
			version: 1,
		})
		
		if(skillData.fileId) {
			await FileToSkillVersion.create({fileId: skillData.fileId!, skillVersionId: skillVersion.id})
		}
		
		const testId = await TestRepository.getTestIdBySkill(skill.id);

		return this.unionSkill(skill, skillVersion, [], skillData.fileId || undefined, testId || undefined);
	}
	
	async readSkill(userId: string, skillId: string) {
		const lastSkillVersion = await this.getLastVersion(skillId);
		
		if(!lastSkillVersion) {
			return;
		}
		
		const version = lastSkillVersion.version;
		
		const isAlreadyViewed = !! await UserSkillView.findOne({where: {userId, skillId, version}})
		
		if(isAlreadyViewed) {
			return;
		}
		
		await UserSkillView.create({userId, skillId, version, date: new Date(Date.now())});
	}
	
	async update(id: string, data: {
		title?: string;
		isActive?: boolean;
		documentId?: string;
	}) {
		const skill = await this.getByID(id);
		
		if (!skill) return false;
		
		updateModel(skill, data);
		
		await skill.save();
		
		return true;
	}
	
	async getAllVersions(skillId: string){
		return await SkillVersion.findAll({where: {skillId}});
	}
	
	async getByID(id: string): Promise<SkillWithTagsInstance | null> {
		return await Skill.findOne({
			where: { id },
			include: [Tag],
		}) as SkillWithTagsInstance;
	}
	
	async get(id: string): Promise<SkillWithVersion | null> {
		const skill = await Skill.findOne({
			where: { id },
			include: {
				model: Tag,
				order: [['createdAt', 'DESC']],
			}
		}) as SkillInstance & {tags: TagInstance[]};
		
		if(! skill) {
			return null;
		}
		const skillVersion = await SkillVersion.findOne({
			where: {
				skillId: id
			},
			include: [{
				model: File,
				order: [['createdAt', 'DESC']],
			}],
			order: [['version', 'DESC']]
		}) as SkillVersionInstance & {files: FileInstance[]};
		
		if(! skillVersion) {
			return null;
		}
		
		const fileId = skillVersion.files.length ? skillVersion.files[0].id : undefined;
		
		const tags = skill.tags.reverse();
		
		const testId = await TestRepository.getTestIdBySkill(skill.id);
		
		return this.unionSkill(skill, skillVersion, tags || [], fileId, testId || undefined);
	}
	
	async getLastVersion(id: string) {
		return await SkillVersion.findOne({
			where: { skillId: id },
			order: [['version', 'DESC']],
		});
	}
	
	async delete(id: string) {
		const deletedCount = await Skill.destroy({ where: { id } });
		return deletedCount > 0;
	}
 
	async getTags(skillId: string): Promise<TagType[]> {
		const skill = await Skill.findByPk(skillId, {
			include: [Tag]
		}) as SkillInstance & {tags: TagInstance[]};

		const { tags } = skill
		
		return tags.map(tag => ({id: tag.id, name: tag.name}));
	}
	
	async getAllForUser(userId: string) {
		const sql = loadSql('get_skills_for_user');
		return await Sequelize.query(
			sql,
			{
				replacements: { userId },
			}
		);
	}
	
	async search({
		query,
		tags,
		authorIds,
		verifierIds,
		approvedDatesArray,
		auditDatesArray,
		limit,
		offset,
		needRevision
	}: {
		query: string,
		tags?: string[],
		authorIds?: string[],
		verifierIds?: string[],
		approvedDatesArray?: Date[],
		auditDatesArray?: Date[],
		limit: number,
		offset: number,
		needRevision: boolean
	}) {
		const sql = loadSql('search_skills');
		
		const [approvedDateStart, approvedDateEnd] = getDateRange(approvedDatesArray);
		const [auditDateStart, auditDateEnd] = getDateRange(auditDatesArray);
		
		const authorIdsJson = authorIds?.length ? JSON.stringify(authorIds) : JSON.stringify([]);
		const verifierIdsJson = verifierIds?.length ? JSON.stringify(verifierIds) : JSON.stringify([]);
		const tagIdsJson = tags?.length ? JSON.stringify(tags) : JSON.stringify([]);
		
		return await Sequelize.query(sql, {
			replacements: {
				query: query ? `%${query}%` : null,
				
				hasAuthorIds: !!authorIds?.length,
				hasVerifierIds: !!verifierIds?.length,
				hasTagIds: !!tags?.length,
				
				authorIdsJson,
				verifierIdsJson,
				tagIdsJson,
				
				approvedDateStart,
				approvedDateEnd,
				auditDateStart,
				auditDateEnd,
				limit,
				offset,
				
				needRevision: needRevision || false
			},
			type: QueryTypes.SELECT,
			plain: true
		});
	}
	
	async getAllUsers(skillId: string): Promise<UserSkillSearch[]> {
		
		const sql = loadSql('get_all_skill_users');
		
		return await Sequelize.query<UserSkillSearch>(
			sql,
			{
				replacements: { skillId },
				type: QueryTypes.SELECT
			}
		);
	}
	
	async createVersion(skillId: string, approvedDate: Date, auditDate: Date, version: number, verifierId: string, authorId?: string, fileId?: string): Promise<SkillVersionInstance> {
		
		const skillVersion = await SkillVersion.create({skillId, authorId, verifierId, auditDate, approvedDate, version});
		
		if(fileId) {
			await FileToSkillVersion.create({fileId: fileId, skillVersionId: skillVersion.id})
		}
		
		return skillVersion;
	}

	async updateVersion(skillVersionId: string, approvedDate: Date, auditDate: Date, verifierId: string, authorId?: string, fileId?: string): Promise<SkillVersionInstance | null> {
		const skillVersion = await SkillVersion.findByPk(skillVersionId) as SkillVersionInstance | null;
		if (!skillVersion) return null;

		skillVersion.approvedDate = approvedDate;
		skillVersion.auditDate = auditDate;
		if (verifierId !== undefined && verifierId !== null) {
			skillVersion.verifierId = verifierId;
		}
		if (authorId !== undefined) {
			skillVersion.authorId = authorId ?? skillVersion.authorId;
		}
		await skillVersion.save();

		if (fileId) {
			const oldFiles = await FileToSkillVersion.findAll({where: {skillVersionId}});
			
			await Promise.all(oldFiles.map(async oldFile => {
				await FileToSkillVersion.destroy({where: {fileId: oldFile.fileId}});
			}));
			
			await FileToSkillVersion.create({ fileId, skillVersionId });
		}

		return skillVersion;
	}
	
	async getVersion(id: string) {
		
		const skillVersion = await SkillVersion.findOne({
			where: { id },
			attributes: ['id', 'skillId', 'version', 'approvedDate', 'auditDate'],
			include: [
				{
					model: File,
					attributes: ['id', 'name', 'mimeType', 'size']
				}
			]
		}) as SkillVersionInstance & {files: FileInstance[]};
		
		return skillVersion;
	}
	
	async getVersions(skillId: string) {
		
		const skillVersions = await SkillVersion.findAll({
			where: { skillId },
			attributes: ['id', 'skillId', 'version', 'approvedDate', 'auditDate'],
			include: [
				{
					model: File,
					attributes: ['id', 'name', 'mimeType', 'size']
				}
			]
		}) as (SkillVersionInstance & {files: FileInstance[]})[];
		
		return skillVersions;
	}
	
	async getByFile(fileId: string) {
		const versionWithFile = await SkillVersion.findOne({
			attributes: ['id', 'skillId', 'version', 'approvedDate', 'auditDate'],
			include: [
				{
					model: File,
					where: { id: fileId },
					attributes: [],
				}
			]
		}) as SkillVersionInstance | null;

		if (!versionWithFile) return null;
		
		const latestVersion = await this.getLastVersion(versionWithFile.skillId) as SkillVersionInstance | null;
		if (!latestVersion || latestVersion.version !== versionWithFile.version) return null;
		
		const skill = await Skill.findOne({
			where: { id: versionWithFile.skillId },
			include: { model: Tag }
		}) as (SkillInstance & { tag: TagInstance[] }) | null;

		if (!skill) return null;

		const tags = skill.tag as unknown as TagType[];
		
		const testId = await TestRepository.getTestIdBySkill(skill.id);

		return this.unionSkill(skill, latestVersion, tags, fileId, testId || undefined);
	}
	
	async deleteVersion(versionId: string) {
		const deletedCount = await SkillVersion.destroy({ where: { id: versionId } });
		return deletedCount > 0;
	}
	
	async deleteSkillVersionConfirms(versionId: string) {
		const version = await this.getVersion(versionId);
		await UserToConfirmSkills.destroy({where: {skillId: version.skillId, version: version.version}})
	}
	
	async addTag(skillId: string, tagId: string) {
		await TagToSkill.create({skillId, tagId});
	}
	
	async isTagExist(skillId: string, tagId: string): Promise<boolean> {
		return !! await TagToSkill.findOne({where: {skillId, tagId}});
	}
	
	async getByTest(testId: string): Promise<SkillWithVersion | null> {
		const test = await Test.findByPk(testId);
		if (!test) return null;

		const currentVersion = await SkillVersion.findByPk(test.skillVersionId) as SkillVersionInstance | null;
		if (!currentVersion) return null;

		const latestVersion = await this.getLastVersion(currentVersion.skillId) as SkillVersionInstance | null;
		if (!latestVersion) return null;

		const skill = await Skill.findOne({ where: { id: latestVersion.skillId }, include: { model: Tag } }) as (SkillInstance & { tag: TagInstance[] }) | null;
		if (!skill) return null;

		const files = await FileToSkillVersion.findAll({ where: { skillVersionId: latestVersion.id } });
		const fileId = files.length ? files[0].fileId : undefined;
		const tags = (skill.tag as unknown as TagType[]) || [];
		const linkedTestId = await TestRepository.getTestIdBySkill(skill.id);

		return this.unionSkill(skill, latestVersion, tags, fileId, linkedTestId || undefined);
	}
	
	async deleteTag(skillId: string, tagId: string) {
		await TagToSkill.destroy({where: {skillId, tagId}});
	}
	
	async getAll() {
		const sql = loadSql('get_all_skills_with_version');
		
		return await Sequelize.query<UserSkillsWithAuthorAndVerifier>(
			sql,
			{
				type: QueryTypes.SELECT
			}
		);
	}
	
	async getUserLevelMatrixBySkills(userIds: string[], skillIds: string[]): Promise<number[][]> {
		const sql = loadSql('get_user_skill_matrix');
		
		const results = await Sequelize.query<UserSkillMatrixResult>(
			sql,
			{
				replacements: {
					userIds,
					skillIds
				},
				type: QueryTypes.SELECT
			}
		);

		// Преобразуем результат в матрицу: skillIds.length строк на userIds.length столбцов
		const matrix: number[][] = [];
		
		for (let skillIndex = 0; skillIndex < skillIds.length; skillIndex++) {
			const row: number[] = [];
			const skillId = skillIds[skillIndex];
			
			for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
				const userId = userIds[userIndex];
				const result = results.find(r => r.skillId === skillId && r.userId === userId);
				row.push(result?.level || 0);
			}
			
			matrix.push(row);
		}
		
		return matrix;
	}
	
	async isAuthorOrVerifier(userId: string, skillId: string | null = null): Promise<boolean> {
		const sql = loadSql('check_is_user_an_author_or_verifier');
		
		const results = await Sequelize.query(
			sql,
			{
				replacements: {
					userId,
					skillId
				},
				type: QueryTypes.SELECT
			}
		);
		
		return !! results.length;
	}
	
	async getUsersBySkillId(skillId: string): Promise<UsersBySkillResult[]> {
		const sql = loadSql('get_users_by_skill_id');
		
		return await Sequelize.query<UsersBySkillResult>(
			sql,
			{
				replacements: { skillId },
				type: QueryTypes.SELECT
			}
		);
	}
	
	async getSkillsByUserId(userId: string): Promise<SkillsByUserResult[]> {
		const sql = loadSql('get_skills_by_user_id');
		
		return await Sequelize.query<SkillsByUserResult>(
			sql,
			{
				replacements: { userId },
				type: QueryTypes.SELECT
			}
		);
	}
	
	async updateRevisionDate(id: string, revisionDate: Date){
		const version = await this.getLastVersion(id);
		
		if(! version) {
			throw ApiError.errorByType('SKILL_VERSION_NOT_FOUND');
		}
		
		console.log(version.auditDate, revisionDate);
		
		version.auditDate = revisionDate;
		
		await version.save();
	}

	async getAllUsersBySkillId(skillId: string): Promise<UsersBySkillResult[]> {
		const sql = loadSql('get_all_skill_users_combined');
		
		return await Sequelize.query<UsersBySkillResult>(
			sql,
			{
				replacements: { skillId },
				type: QueryTypes.SELECT
			}
		);
	}
	
	
	private unionSkill(skill: SkillInstance, skillVersion: SkillVersionInstance, tags: TagType[], fileId?: string, testId?: string): SkillWithVersion  {
		return {
			id: skill.id,
			type: skill.type,
			title: skill.title,
			isActive: skill.isActive,
			approvedDate: skillVersion.approvedDate,
			auditDate: skillVersion.auditDate,
			authorId: skillVersion.authorId,
			verifierId: skillVersion.verifierId,
			version: skillVersion.version,
			documentId: skill.documentId,
			tags,
			fileId,
			testId
		}
	}
}

export default new SkillRepository();
