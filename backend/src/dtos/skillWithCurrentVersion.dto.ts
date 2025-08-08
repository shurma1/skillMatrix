import {TagDTO} from "./tag.dto";

export enum SkillType {
	Skill = 'skill',
	Document = 'document',
}

/**
 * @openapi
 * components:
 *   schemas:
 *     SkillWithCurrentVersionDTO:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         type: { type: string, enum: [skill, document] }
 *         title: { type: string }
 *         isActive: { type: boolean }
 *         approvedDate: { type: string, format: date-time }
 *         auditDate: { type: string, format: date-time }
 *         authorId: { type: string, nullable: true }
 *         verifierId: { type: string }
 *         version: { type: integer }
 *         tags:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TagDTO'
 *         testId: { type: string, nullable: true }
 */
export class SkillWithCurrentVersionDTO {
	id: string;
	type: SkillType;
	title: string;
	isActive: boolean;
	approvedDate: Date;
	auditDate: Date;
	authorId: string | null;
	verifierId: string;
	version: number;
	tags: TagDTO[];
	testId?: string;
	
	
	constructor(
		id: string,
		type: SkillType,
		title: string,
		isActive: boolean,
		approvedDate: Date,
		auditDate: Date,
		authorId: string | null,
		verifierId: string,
		version: number,
		tags: TagDTO[],
		testId?: string,
	) {
		this.id = id;
		this.type = type;
		this.title = title;
		this.isActive = isActive;
		this.approvedDate = approvedDate;
		this.auditDate = auditDate;
		this.authorId = authorId;
		this.verifierId = verifierId;
		this.version = version;
		this.tags = tags;
		this.testId = testId;
	}
}
