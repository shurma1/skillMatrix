import {TagSearchDTO} from "./tag.dto";
import {SkillType} from "../models/types/SkillType";

/**
 * @openapi
 * components:
 *   schemas:
 *     JobRoleSkillSearchDTO:
 *       type: object
 *       properties:
 *         skillId: { type: string }
 *         title: { type: string }
 *         type: { type: string }
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TagSearchDTO'
 *         targetLevel: { type: integer }
 *         testId: { type: string, nullable: true }
 */
export class JobRoleSkillSearchDTO {
	skillId: string;
	testId?: string;
	title: string;
	type: SkillType;
	tags: TagSearchDTO[];
	auditDate: Date;
	approvedDate: Date;
	targetLevel: number;
	isActive: boolean;
	
	constructor(
		skillId: string,
		title: string,
		type: SkillType,
		tags: TagSearchDTO[],
		targetLevel: number,
		auditDate: Date,
		approvedDate: Date,
		isActive: boolean,
		testId?: string,
	) {
		this.skillId = skillId;
		this.title = title;
		this.type = type;
		this.tags = tags;
		this.targetLevel = targetLevel;
		this.auditDate = auditDate;
		this.approvedDate = approvedDate;
		this.testId = testId;
		this.isActive = isActive;
	}
}
