import {TagSearchDTO} from "./tag.dto";
import {SkillType} from "../models/types/SkillType";

export class JobRoleSkillSearchDTO {
	skillId: string;
	testId?: string;
	title: string;
	type: SkillType;
	tags: TagSearchDTO[];
	targetLevel: number;
	
	constructor(
		skillId: string,
		title: string,
		type: SkillType,
		tags: TagSearchDTO[],
		targetLevel: number,
		testId?: string,
	) {
		this.skillId = skillId;
		this.title = title;
		this.type = type;
		this.tags = tags;
		this.targetLevel = targetLevel;
		this.testId = testId;
	}
}
