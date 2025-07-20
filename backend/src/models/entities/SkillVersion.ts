import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface SkillVersionAttributes {
  id: string;
  skillId: string;
  authorId: string;
  verifierId: string;
  approvedDate: Date;
  auditDate: Date;
  version: number;
}

type SkillVersionCreationAttributes = Omit<SkillVersionAttributes, 'id'>;

export interface SkillVersionInstance extends Model<SkillVersionAttributes, SkillVersionCreationAttributes>, SkillVersionAttributes {}

const SkillVersion = sequelize.define<SkillVersionInstance>('skillVersion', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  skillId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  verifierId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  approvedDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  auditDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default SkillVersion;
