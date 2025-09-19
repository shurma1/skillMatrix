import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface SkillNotifyAttributes {
  id: string;
  skillId: string;
}

type SkillNotifyCreationAttributes = Omit<SkillNotifyAttributes, 'id'>;

export interface SkillNotifyInstance extends Model<SkillNotifyAttributes, SkillNotifyCreationAttributes>, SkillNotifyAttributes {}

const SkillNotify = sequelize.define<SkillNotifyInstance>('skill_notify', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	skillId: {
		type: DataTypes.UUID,
		allowNull: false,
	},
});

export default SkillNotify;
