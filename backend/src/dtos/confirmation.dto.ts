import {SkillConfirmType} from "../models/types/SkillConfirmType";

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
