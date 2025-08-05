import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface UserToSkillsAttributes {
  id: string;
  targetLevel: number;
  userId: string;
  skillId: string;
  isIncludeInTarget: boolean;
}

type UserToSkillsCreationAttributes = Omit<UserToSkillsAttributes, 'id'>;

export interface UserToSkillsInstance extends Model<UserToSkillsAttributes, UserToSkillsCreationAttributes>, UserToSkillsAttributes {}

const UserToSkills = sequelize.define<UserToSkillsInstance>('userToSkills', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	targetLevel: {
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
	isIncludeInTarget: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
});

export default UserToSkills;
