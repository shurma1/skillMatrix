import {SkillType} from "../models/types/SkillType";
import {TagDTO} from "./tag.dto";

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
