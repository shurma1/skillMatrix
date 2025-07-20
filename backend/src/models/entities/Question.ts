import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface QuestionAttributes {
  id: string;
  testId: string;
  type: string;
  text: string;
}

type QuestionCreationAttributes = Omit<QuestionAttributes, 'id'>;

export interface QuestionInstance extends Model<QuestionAttributes, QuestionCreationAttributes>, QuestionAttributes {}

const Question = sequelize.define<QuestionInstance>('question', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  testId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Question;
