import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';
import { SkillConfirmType } from '../types/SkillConfirmType';

interface UserToConfirmSkillsAttributes {
  id: string;
  type: SkillConfirmType;
  level: number;
  userId: string;
  skillId: string;
  version: number;
  date: Date;
}

type UserToConfirmSkillsCreationAttributes = Omit<UserToConfirmSkillsAttributes, 'id'>;

export interface UserToConfirmSkillsInstance extends Model<UserToConfirmSkillsAttributes, UserToConfirmSkillsCreationAttributes>, UserToConfirmSkillsAttributes {}

const UserToConfirmSkills = sequelize.define<UserToConfirmSkillsInstance>('userToConfirmSkills', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	type: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	level: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	userId: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	skillId: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	version: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	date: {
		type: DataTypes.DATE,
		allowNull: false,
	},
});

export default UserToConfirmSkills;
