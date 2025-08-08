import {SkillType} from "../models/types/SkillType";
import {TagDTO} from "./tag.dto";
import {UserSkillSearchDto} from "./userSkillSearch.dto";
import {ConfirmationDTO} from "./confirmation.dto";

/**
 * @openapi
 * components:
 *   schemas:
 *     UserSkillDto:
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
 *         confirmations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ConfirmationDTO'
 *         testId: { type: string, nullable: true }
 */
export class UserSkillDto extends UserSkillSearchDto{
	confirmations: ConfirmationDTO[]
	
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
		confirmations: ConfirmationDTO[],
		testId?: string,
	) {
		super(skillId, title, type, level, targetLevel, isConfirmed, isNew, tags, userId, login, firstname, patronymic, avatarId, testId);
		
		this.confirmations = confirmations;
	}
}
