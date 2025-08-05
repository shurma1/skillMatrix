import {SkillInstance} from '../models/entities/Skill';
import {TagInstance} from '../models/entities/Tag';
import {SkillType} from "../dtos/skillWithCurrentVersion.dto";
import {updateModel} from "../utils/updateModel";
import {SkillVersion, TagToSkill, Tag, Skill, File} from "../models";
import {SkillVersionInstance} from "../models/entities/SkillVersion";
import {loadSql} from "../utils/loadSql";
import {Sequelize} from '../models/index';
import {QueryTypes} from "sequelize";
import {getDateRange} from "../utils/getDateRange";
import {UserSkillSearch} from "./user.repossitory";
import {FileInstance} from "../models/entities/File";
import TestRepository from "./test.repository";

export interface SkillWithTagsInstance extends SkillInstance {
	tags: TagInstance[];
}


export interface SkillCreation {
	type: SkillType;
	title: string;
	approvedDate: Date;
	auditDate: Date;
	verifierId: string;
	authorId: string | null;
	isActive: boolean;
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
		});
		
		const skillVersion = await SkillVersion.create({
			skillId: skill.id,
			authorId: skillData.authorId,
			verifierId: skillData.verifierId,
			approvedDate: skillData.approvedDate,
			auditDate: skillData.auditDate,
			version: 1,
		})
		
		const testId = await TestRepository.getTestIdBySkill(skill.id);

		return this.unionSkill(skill, skillVersion, [], testId || undefined);
	}
	
	async update(id: string, data: {
		title?: string;
		isActive?: boolean;
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
			}
		}) as SkillInstance & {tag: TagInstance[]};
		
		if(! skill) {
			return null;
		}
		const skillVersion = await SkillVersion.findOne({
			where: {
				skillId: id
			},
			order: [['version', 'DESC']] // Сортируем по версии в убывающем порядке
		});
		
		if(! skillVersion) {
			return null;
		}
		
		const tags = skill.tag;
		
		const testId = await TestRepository.getTestIdBySkill(skill.id);
		
		return this.unionSkill(skill, skillVersion, tags, testId || undefined);
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
	}: {
		query: string,
		tags?: string[],
		authorIds?: string[],
		verifierIds?: string[],
		approvedDatesArray?: Date[],
		auditDatesArray?: Date[],
	}) {
		const sql = loadSql('search_skills');
		
		const [approvedDateStart, approvedDateEnd] = getDateRange(approvedDatesArray);
		const [auditDateStart, auditDateEnd] = getDateRange(auditDatesArray);
		
		return await Sequelize.query(
			sql,
			{
				replacements: {
					query: query ? `%${query}%` : null,
					tags: tags && tags.length ? tags : null,
					tagsLength: tags ? tags.length : 0,
					authorIds: authorIds && authorIds.length ? authorIds : null,
					verifierIds: verifierIds && verifierIds.length ? verifierIds : null,
					approvedDateStart,
					approvedDateEnd,
					auditDateStart,
					auditDateEnd,
				},
				type: QueryTypes.SELECT,
			}
		);
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
	
	async createVersion(skillId: string, approvedDate: Date, auditDate: Date, version: number, verifierId: string, authorId?: string): Promise<SkillVersionInstance> {
		
		const skillVersion = await SkillVersion.create({skillId, authorId, verifierId, auditDate, approvedDate, version});
		
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
	
	async deleteVersion(versionId: string) {
		const deletedCount = await SkillVersion.destroy({ where: { id: versionId } });
		return deletedCount > 0;
	}
	
	async addTag(skillId: string, tagId: string) {
		await TagToSkill.create({skillId, tagId});
	}
	
	async isTagExist(skillId: string, tagId: string): Promise<boolean> {
		return !! await TagToSkill.findOne({where: {skillId, tagId}});
	}
	
	async deleteTag(skillId: string, tagId: string) {
		await TagToSkill.destroy({where: {skillId, tagId}});
	}
	
	
	private unionSkill(skill: SkillInstance, skillVersion: SkillVersionInstance, tags: TagType[], testId?: string): SkillWithVersion  {
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
			tags,
			testId
		}
	}
}

export default new SkillRepository();
