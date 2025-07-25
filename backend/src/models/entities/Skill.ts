import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface SkillAttributes {
  id: string;
  type: string;
  title: string;
  isActive: boolean;
}

type SkillCreationAttributes = Omit<SkillAttributes, 'id'>;

export interface SkillInstance extends Model<SkillAttributes, SkillCreationAttributes>, SkillAttributes {}

const Skill = sequelize.define<SkillInstance>('skill', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

export default Skill;
