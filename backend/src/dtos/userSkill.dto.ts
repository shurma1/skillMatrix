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
export interface UserSkillDto extends UserSkillSearchDto{
	confirmations: ConfirmationDTO[]
}
