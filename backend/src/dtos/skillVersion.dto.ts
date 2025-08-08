import {FileDTO} from "./file.dto";

/**
 * @openapi
 * components:
 *   schemas:
 *     SkillVersionDTO:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         skillId: { type: string }
 *         version: { type: integer }
 *         approvedDate: { type: string, format: date-time }
 *         auditDate: { type: string, format: date-time }
 *         files:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FileDTO'
 *         testId:
 *           type: string
 *           nullable: true
 */
export class SkillVersionDTO {
	id: string;
	skillId: string;
	version: number;
	approvedDate: Date;
	auditDate: Date;
	files: FileDTO[];
	testId?: string;
	
	constructor(
		id: string,
		skillId: string,
		version: number,
		approvedDate: Date,
		auditDate: Date,
		files: FileDTO[],
		testId?: string
	) {
		this.id = id;
		this.skillId = skillId;
		this.version = version;
		this.approvedDate = approvedDate;
		this.auditDate = auditDate;
		this.files = files;
		this.testId = testId;
	}
}
