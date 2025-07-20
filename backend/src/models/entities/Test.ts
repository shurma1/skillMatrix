import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface TestAttributes {
  id: string;
  skillId: string;
  questionsCount: number;
  needScore: number;
  timeLimit: number;
}

type TestCreationAttributes = Omit<TestAttributes, 'id'>;

export interface TestInstance extends Model<TestAttributes, TestCreationAttributes>, TestAttributes {}

const Test = sequelize.define<TestInstance>('test', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  skillId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  questionsCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  needScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timeLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Test;
