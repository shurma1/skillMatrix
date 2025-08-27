import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface MailAttributes {
  id: string;
  email: string;
  createdAt?: string;
}

type MailCreationAttributes = Omit<MailAttributes, 'id' | 'createdAt'>;

export interface MailInstance extends Model<MailAttributes, MailCreationAttributes>, MailAttributes {}

const Mail = sequelize.define<MailInstance>('mail', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

export default Mail;
