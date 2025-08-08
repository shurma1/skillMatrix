import {SkillConfirmType} from "../models/types/SkillConfirmType";

/**
 * @openapi
 * components:
 *   schemas:
 *     ConfirmationDTO:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         type: { type: string, enum: [acquired, debuff] }
 *         level: { type: integer }
 *         date: { type: string, format: date-time }
 *         version: { type: integer }
 */
export class ConfirmationDTO {
	id: string;
	type: SkillConfirmType;
	level: number;
	date: Date;
	version: number;
	
	constructor(
		id: string,
		type: SkillConfirmType,
		level: number,
		date: Date,
		version: number
	) {
		this.id = id;
		this.type = type;
		this.level = level;
		this.date = date;
		this.version = version;
	}
}
