import SkillRepository, {SkillCreation} from "../repositories/skill.repository";
import {SkillWithCurrentVersionDTO} from "../dtos/skillWithCurrentVersion.dto";
import {ApiError} from "../error/apiError";
import config from "config";
import FileService from "./file.service";
import {SkillVersionDTO} from "../dtos/skillVersion.dto";
import {FileDTO} from "../dtos/file.dto";
import {UserSkillSearchDto} from "../dtos/userSkillSearch.dto";
import TestRepository from "../repositories/test.repository";
import {PaginationDTO} from "../dtos/Pagination.dto";
import UserService from "./user.service";
import {SkillConfirmType} from "../models/types/SkillConfirmType";

const MOUNTS_BEFORE_AUDIT = config.get<number>('times.MOUNTS_BEFORE_AUDIT');

class SkillService {
	async create(skillData: Omit<SkillCreation, 'auditDate' | 'isActive'>) {
		
		const MOUNTS_BEFORE_AUDIT = config.get<number>('times.MOUNTS_BEFORE_AUDIT');
		
		const auditDate = new Date(skillData.approvedDate);
		auditDate.setMonth(auditDate.getMonth() + MOUNTS_BEFORE_AUDIT);
		
		const skill =  await SkillRepository.create({...skillData, auditDate, isActive: true});
		return skill as SkillWithCurrentVersionDTO;
	}
	
	async search(
		query: string,
		limit: number,
		offset: number,
		tags?: string[],
		authorIds?: string[],
		verifierIds?: string[],
		approvedDatesArray?: Date[],
		auditDatesArray?: Date[],
	) {
		const skills = await SkillRepository.search({
			query,
			tags,
			authorIds,
			verifierIds,
			approvedDatesArray,
			auditDatesArray,
			limit,
			offset
		})
		
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		return skills.result as PaginationDTO<SkillWithCurrentVersionDTO>;
	}
	
	async checkSkillExist(id: string) {
		const skill = await SkillRepository.getByID(id);
		
		if(! skill) {
			throw ApiError.errorByType('SKILL_NOT_FOUND');
		}
	}
	
	async checkSkillVersionExist(versionId: string) {
		const skillVersion = await SkillRepository.getVersion(versionId);
		
		if(! skillVersion) {
			throw ApiError.errorByType('SKILL_VERSION_NOT_FOUND');
		}
	}
	
	async delete(id: string) {
		await this.checkSkillExist(id);
		return await SkillRepository.delete(id);
	}
	
	async get(id: string) {
		const skill = await SkillRepository.get(id);
		
		if(! skill) {
			throw ApiError.errorByType('SKILL_NOT_FOUND');
		}
		
		return skill as SkillWithCurrentVersionDTO;
	}
	
	async readSkill(id: string, userId: string) {
		await SkillRepository.readSkill(userId, id);
	}
	
	async update(id: string, title: string, isActive: boolean) {
		await this.checkSkillExist(id);
		
		const isUpdated = await SkillRepository.update(id, {title, isActive});
		
		if(! isUpdated) {
			throw ApiError.errorByType('SKILL_NOT_FOUND');
		}
		
		return this.get(id);
	}
	
	async getAllUsers(id: string) {
		await this.checkSkillExist(id);
		
		const users = await SkillRepository.getAllUsers(id);
		
		return users as UserSkillSearchDto[];
	}
	
	
	async createVersion(
		skillId: string,
		fileId: string,
		authorId: string,
		verifierid: string,
	): Promise<SkillVersionDTO> {
		await this.checkSkillExist(skillId);
		
		if(fileId) {
			await FileService.checkFileExist(fileId);
		}
		
		const lastVersion = await SkillRepository.getLastVersion(skillId);
		
		const version = (lastVersion?.version || 0) + 1;
		
		const now = new Date(Date.now());
		const auditDate = new Date(now);
		auditDate.setMonth(auditDate.getMonth() + MOUNTS_BEFORE_AUDIT);
		
		const skillVersion = await SkillRepository.createVersion(skillId, now, auditDate, version, verifierid, authorId, fileId);
		
		return this.getVersion(skillVersion.id);
	}
	
	async getVersion(id: string): Promise<SkillVersionDTO> {
		const skillVersion = await SkillRepository.getVersion(id);
		
		const testId = await TestRepository.getTestIdBySkill(id);
		
		return new SkillVersionDTO(
			skillVersion.id,
			skillVersion.skillId,
			skillVersion.version,
			skillVersion.approvedDate,
			skillVersion.auditDate,
			skillVersion.files.map(file =>
				new FileDTO(
					file.id,
					file.name,
					file.mimeType,
					file.size,
					file.filename,
					file.createdAt!
				)
			),
			testId || undefined
		)
	}
	
	async getVersions(skillId: string) : Promise<SkillVersionDTO[]>{
		const skillVersions = await SkillRepository.getVersions(skillId);
		
		const promises = skillVersions.map(async version =>
			new SkillVersionDTO(
				version.id,
				version.skillId,
				version.version,
				version.approvedDate,
				version.auditDate,
				version.files.map(file =>
					new FileDTO(
						file.id,
						file.name,
						file.mimeType,
						file.size,
						file.filename,
						file.createdAt!
					)
				),
				await TestRepository.getTestIdBySkill(version.skillId) || undefined
			)
		);
		
		
		
		return await Promise.all(promises);
	}
	
	async deleteVersion(id: string) {
		await this.checkSkillVersionExist(id);
		return await SkillRepository.deleteVersion(id);
	}
	
	async addTag(skillId: string, tagId: string) {
		await this.checkSkillExist(skillId);
		
		const isTagAlreadyAdded = await SkillRepository.isTagExist(skillId, tagId);
		
		if(isTagAlreadyAdded) {
			throw ApiError.errorByType('TAG_ALREADY_ADDED')
		}
		
		await SkillRepository.addTag(skillId, tagId);
	}
	
	async deleteTag(skillId: string, tagId: string) {
		await this.checkSkillExist(skillId);
		
		const isTagAlreadyAdded = await SkillRepository.isTagExist(skillId, tagId);
		
		if(! isTagAlreadyAdded) {
			throw ApiError.errorByType('TAG_NOT_FOUND');
		}
		
		await SkillRepository.deleteTag(skillId, tagId);
	}
	
	async getTags(skillId: string) {
		await this.checkSkillExist(skillId);
		
		await SkillRepository.getTags(skillId);
	}
	
	async confirmFileStudy(fileId: string, userId: string) {
		await FileService.checkFileExist(fileId);
		await UserService.checkIsUserExist(userId);
		
		const skill = await SkillRepository.getByFile(fileId);
		
		if(! skill) {
			throw ApiError.errorByType('SKILL_NOT_FOUND');
		}
		
		const confirmations = await UserService.getConfirmations(userId, skill.id);
		
		const currentLevel = confirmations.length === 0 ? 0 : confirmations[0].level;
		
		if(currentLevel > 0) {
			throw ApiError.errorByType('ALREADY_CONFIRM')
		}
		
		const isDebuffed = confirmations.length === 0 ? false : confirmations[0].type === SkillConfirmType.Debuff;
		const maxLevel = confirmations.length === 0 ? 0 :
			(() => {
				const Confirmation = confirmations.find(
					conf =>
						conf.type === SkillConfirmType.Acquired
						|| conf.type === SkillConfirmType.AdminSet
				);
				return Confirmation
					? Confirmation.level
					: 0;
			})();
		
		const levelForFileStudyConfirmation = 1;
		
		await UserService.addConfirmation(
			userId,
			skill.id,
			SkillConfirmType.Acquired,
			isDebuffed ? maxLevel : levelForFileStudyConfirmation
		)
	}
	
	async checkExpirationDateOfTheSkills() {
		// оповещалка авторов за месяц до истечения skill
	}
	
	async checkExpirationDateOfTheUserSkills() {
		// проверка, не истекли ли у пользователя навыки
	}
}

export default new SkillService();
