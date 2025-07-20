import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface TagToSkillAttributes {
  id: string;
  tagId: string;
  skillId: string;
}

type TagToSkillCreationAttributes = Omit<TagToSkillAttributes, 'id'>;

export interface TagToSkillInstance extends Model<TagToSkillAttributes, TagToSkillCreationAttributes>, TagToSkillAttributes {}

const TagToSkill = sequelize.define<TagToSkillInstance>('tagToSkill', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  tagId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  skillId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

export default TagToSkill;
