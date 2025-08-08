import {SkillType} from "../models/types/SkillType";
import {TagDTO} from "./tag.dto";

/**
 * @openapi
 * components:
 *   schemas:
 *     UserSkillSearchDto:
 *       type: object
 *       properties:
 *         skillId: { type: string }
 *         title: { type: string }
 *         type: { type: string }
 *         level: { type: integer }
 *         targetLevel: { type: integer }
 *         isConfirmed: { type: boolean }
 *         isNew: { type: boolean }
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TagDTO'
 *         userId: { type: string }
 *         login: { type: string }
 *         firstname: { type: string }
 *         patronymic: { type: string }
 *         avatarId: { type: string }
 *         testId: { type: string, nullable: true }
 */
export class UserSkillSearchDto {
	skillId: string;
	title: string;
	type: SkillType;
	level: number;
	targetLevel: number;
	isConfirmed: boolean;
	isNew: boolean;
	tags: TagDTO[];
	userId: string;
	login: string;
	firstname: string;
	patronymic: string;
	avatarId: string;
	testId?: string;
	
	constructor(
		skillId: string,
		title: string,
		type: SkillType,
		level: number,
		targetLevel: number,
		isConfirmed: boolean,
		isNew: boolean,
		tags: TagDTO[],
		userId: string,
		login: string,
		firstname: string,
		patronymic: string,
		avatarId: string,
		testId?: string,
	) {
		this.skillId = skillId;
		this.title = title;
		this.type = type;
		this.level = level;
		this.targetLevel = targetLevel;
		this.isConfirmed = isConfirmed;
		this.isNew = isNew;
		this.tags = tags;
		this.userId = userId;
		this.login = login;
		this.firstname = firstname;
		this.patronymic = patronymic;
		this.avatarId = avatarId;
		this.testId = testId;
	}
}
