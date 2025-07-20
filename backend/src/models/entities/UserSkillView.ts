import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface UserSkillViewAttributes {
  id: string;
  userId: string;
  skillId: string;
  version: number;
  date: Date;
}

type UserSkillViewCreationAttributes = Omit<UserSkillViewAttributes, 'id'>;

export interface UserSkillViewInstance extends Model<UserSkillViewAttributes, UserSkillViewCreationAttributes>, UserSkillViewAttributes {}

const UserSkillView = sequelize.define<UserSkillViewInstance>('userSkillView', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
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

export default UserSkillView;
