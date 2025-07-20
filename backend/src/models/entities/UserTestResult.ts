import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface UserTestResultAttributes {
  id: string;
  userTestId: string;
  qwestonId: string;
  answerId: string;
}

type UserTestResultCreationAttributes = Omit<UserTestResultAttributes, 'id'>;

export interface UserTestResultInstance extends Model<UserTestResultAttributes, UserTestResultCreationAttributes>, UserTestResultAttributes {}

const UserTestResult = sequelize.define<UserTestResultInstance>('userTestResult', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userTestId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  qwestonId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  answerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

export default UserTestResult;
