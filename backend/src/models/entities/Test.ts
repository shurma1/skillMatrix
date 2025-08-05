import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface TestAttributes {
  id: string;
  title: string;
  skillVersionId: string;
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
	title: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	skillVersionId: {
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
