import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface PermissionAttributes {
  id: string;
  name: string;
  description: string
}

type PermissionCreationAttributes = Omit<PermissionAttributes, 'id'>;

export interface PermissionInstance extends Model<PermissionAttributes, PermissionCreationAttributes>, PermissionAttributes {}

const Permission = sequelize.define<PermissionInstance>('permission', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	name: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false,
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

export default Permission;
