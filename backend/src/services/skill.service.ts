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
import TagRepository from "../repositories/tag.repository";
import JobRoleRepository from "../repositories/jobRole.repository";
import JobRoleService from "./jobRole.service";
import MailService from "./mail.service";
import MailRepository from "../repositories/mail.repository";
import {formatDate} from "../utils/formatDate";
import {generateAuditReminderHtml} from "../utils/mailTemplates";

const MOUNTS_BEFORE_AUDIT = config.get<number>('times.MOUNTS_BEFORE_AUDIT');
const MOUNTS_TO_NOTIFY = config.get<number>('times.MOUNTS_TO_NOTIFY');

class SkillService {
	async create(skillData: Omit<SkillCreation, 'auditDate' | 'isActive'>) {
		
		const MOUNTS_BEFORE_AUDIT = config.get<number>('times.MOUNTS_BEFORE_AUDIT');
		
		const auditDate = new Date(skillData.approvedDate);
		auditDate.setMonth(auditDate.getMonth() + MOUNTS_BEFORE_AUDIT);
		
		const skill =  await SkillRepository.create({...skillData, auditDate, isActive: true});
		
		if(skillData.authorId !== null && typeof skillData.authorId !== 'undefined') {
			await UserService.addConfirmation(skillData.authorId, skill.id, SkillConfirmType.Acquired, 5);
		}
		
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
		
		return skill;
	}
	
	async checkSkillVersionExist(versionId: string) {
		const skillVersion = await SkillRepository.getVersion(versionId);
		
		if(! skillVersion) {
			throw ApiError.errorByType('SKILL_VERSION_NOT_FOUND');
		}
		return skillVersion;
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
	
	async update(id: string, title?: string, isActive?: boolean, tags?: string[], documentId?: string) {
		const skill = await this.checkSkillExist(id);
		const isUpdated = await SkillRepository.update(id, { title, isActive, documentId });
		
		if (!isUpdated) {
			throw ApiError.errorByType('SKILL_NOT_FOUND');
		}

		if (tags) {
			const toRemove = skill.tags.map(tag => tag.id);
			const toAdd = tags;
		
			if (toRemove.length > 0) {
				for (const removeTagId of toRemove) {
					await SkillRepository.deleteTag(skill.id, removeTagId)
				}
			}
			
			if (toAdd.length > 0) {
				for (const addTagId of toAdd) {
					const isTagExist = !! await TagRepository.getById(addTagId);
					
					if(isTagExist) {
						await SkillRepository.addTag(skill.id, addTagId)
					}
				}
			}
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
		approvedDate?: string,
	): Promise<SkillVersionDTO> {
		await this.checkSkillExist(skillId);
		
		if(fileId) {
			await FileService.checkFileExist(fileId);
		}
		
		const lastVersion = await SkillRepository.getLastVersion(skillId);
		
		const version = (lastVersion?.version || 0) + 1;
		const approved = approvedDate ? new Date(approvedDate) : new Date(Date.now());
		const auditDate = new Date(approved);
		auditDate.setMonth(auditDate.getMonth() + MOUNTS_BEFORE_AUDIT);
		
		const skillVersion = await SkillRepository.createVersion(skillId, approved, auditDate, version, verifierid, authorId, fileId);
		
		const users = await SkillRepository.getAllUsers(skillId); //todo: получает не всех пользователей, нужно нщн получать по работе. при подтверждении навыка восстановить уровень
		const usersFromJobroleSkill = await JobRoleRepository.getUsersBySkillId(skillId);
		
		const userIds = [
			...users.map(user => user.userId),
			...usersFromJobroleSkill.map(user => user.id)
		]
		
		if(authorId) {
			await UserService.addConfirmation(authorId, skillId, SkillConfirmType.Acquired, 5);
		}
		
		await Promise.all(userIds.map(async userId => {
			if(userId !== authorId) {
				await UserService.addConfirmation(userId, skillId, SkillConfirmType.Debuff, 0);
			}
		}))
		
		return this.getVersion(skillVersion.id);
	}
	
	async updateVersion(
		skillVersionId: string,
		skillId: string,
		fileId: string,
		authorId: string,
		verifierid: string,
		approvedDate?: string,
	): Promise<SkillVersionDTO> {
		const skillVersion = await this.checkSkillVersionExist(skillVersionId);
		
		const previousAuthorId = skillVersion.authorId;
		
		if (fileId) {
			await FileService.checkFileExist(fileId);
		}
		
		const current = await SkillRepository.getVersion(skillVersionId);
		const approved = approvedDate ? new Date(approvedDate) : current.approvedDate;
		const auditDate = new Date(approved);
		auditDate.setMonth(auditDate.getMonth() + MOUNTS_BEFORE_AUDIT);
		
		const finalVerifierId = verifierid ?? current.verifierId;
		const finalAuthorId = (authorId ?? current.authorId) || undefined;
		
		const updated = await SkillRepository.updateVersion(skillVersionId, approved, auditDate, finalVerifierId, finalAuthorId, fileId);
		if (!updated) {
			throw ApiError.errorByType('SKILL_VERSION_NOT_FOUND');
		}
		
		if(authorId !== previousAuthorId) {
			if(previousAuthorId !== null) {
				const confirmations = await UserService.getConfirmations(previousAuthorId, skillId);
				let level = 0;
				
				if(confirmations.length >= 2) {
					level = confirmations[1].level;
				}
				
				await UserService.addConfirmation(previousAuthorId, skillId, SkillConfirmType.Debuff, level);
			}
			
			if(authorId !== null) {
				await UserService.addConfirmation(authorId, skillId, SkillConfirmType.Acquired, 5);
			}
			
		}
		
		return this.getVersion(updated.id);
	}
	
	async getVersion(id: string): Promise<SkillVersionDTO> {
		const skillVersion = await SkillRepository.getVersion(id);
		
		const testId = await TestRepository.getTestIdBySkill(skillVersion.skillId);
		
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
		
		await SkillRepository.deleteSkillVersionConfirms(id);
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
		console.log(confirmations);
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
	
	async isAuthorOrVerifier(userId: string, skillId?: string) {
		return await SkillRepository.isAuthorOrVerifier(userId, skillId);
	}
	
	async getAll() {
		return SkillRepository.getAll();
	}
	
	async checkExpirationDateOfTheSkills() {
		console.log('run task [2]')
		const now = new Date();
		const notifyUntil = new Date(now);
		notifyUntil.setMonth(notifyUntil.getMonth() + MOUNTS_TO_NOTIFY);
		
		const skills = await this.getAll();
		
		for (const skill of skills) {
			const auditDate = new Date(skill.auditDate);
			
			if(skill.authorId) {
				if (auditDate > now && auditDate <= notifyUntil) {
					const user = await UserService.getByID(skill.authorId);
					
					if(user.email) {
						if (!(await MailRepository.wasNotifiedInLastMonths(user.email, 1))) {
							await MailService.SendMail({
								recipient: user.email,
								title: `Напоминание. Проведите ревизию документа ${skill.title} до ${formatDate(auditDate)}`,
								HTML: generateAuditReminderHtml(skill.title, formatDate(auditDate) || '', `${user.firstname} ${user.patronymic}`)
							});
							await MailRepository.create(user.email);
						}
					}
				}
			}
		}
	}
	
	async checkExpirationDateOfTheUserSkills() {
		const users = await UserService.getAll();
		
		for (const user of users) {
			const skills = await UserService.getAllSkills(user.id);
			const jobs = await UserService.getAllJobroles(user.id);
			const jobRoleSkills = (
				await Promise.all(
					jobs.map(job => JobRoleService.getSkills(job.jobRoleId))
				)
			).flat();
			
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-expect-error
			skills.push(...jobRoleSkills as UserSkillSearchDto)
			
			for(const skill of skills) {
				const confirmations = await UserService.getConfirmations(user.id, skill.skillId);
				if(! confirmations.length) {
					continue;
				}
				const auditDate = new Date(skill.auditDate);
				const lastConfirmation = confirmations[0];
				
				if(lastConfirmation.level === 0) {
					continue;
				}
				
				const confirmationDate = new Date(confirmations[0].date);
				
				if(confirmationDate > auditDate) {
					await UserService.addConfirmation(user.id, skill.skillId, SkillConfirmType.Debuff, 0);
				}
			}
		}
		
	}
}

export default new SkillService();
