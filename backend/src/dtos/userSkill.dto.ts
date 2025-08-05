import {SkillType} from "../models/types/SkillType";
import {TagDTO} from "./tag.dto";
import {UserSkillSearchDto} from "./userSkillSearch.dto";
import {ConfirmationDTO} from "./confirmation.dto";

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
