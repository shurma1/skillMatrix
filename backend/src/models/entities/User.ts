import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface UserAttributes{
	id: string;
	login: string;
	firstname: string;
	lastname: number;
	patronymic: string;
	email?: string;
	password_hash: string;
	avatar_id?: string
}

type UserCreationAttributes = Omit<UserAttributes, 'id'>

export interface UserInstance
	extends Model<UserAttributes, UserCreationAttributes>,
		UserAttributes {}

const User = sequelize.define<UserInstance>('user', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	login: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	firstname: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	lastname: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	patronymic: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	password_hash: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	// avatar_id не указывается напрямую, т.к. будет создан при указании связей
});

export default User;
