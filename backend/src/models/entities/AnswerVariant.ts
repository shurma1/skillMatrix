import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface AnswerVariantAttributes {
  id: string;
  questionId: string;
  text: string;
  isTrue: boolean;
}

type AnswerVariantCreationAttributes = Omit<AnswerVariantAttributes, 'id'>;

export interface AnswerVariantInstance extends Model<AnswerVariantAttributes, AnswerVariantCreationAttributes>, AnswerVariantAttributes {}

const AnswerVariant = sequelize.define<AnswerVariantInstance>('answerVariant', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	questionId: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	text: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	isTrue: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
});

export default AnswerVariant;
