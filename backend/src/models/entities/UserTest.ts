import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface UserTestAttributes {
  id: string;
  userId: string;
  testId: string;
  targetScore: number;
  score: number;
}

type UserTestCreationAttributes = Omit<UserTestAttributes, 'id'>;

export interface UserTestInstance extends Model<UserTestAttributes, UserTestCreationAttributes>, UserTestAttributes {}

const UserTest = sequelize.define<UserTestInstance>('userTest', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	userId: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	testId: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	targetScore: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	score: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

export default UserTest;
