import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface TagAttributes {
  id: string;
  name: string;
  color: string;
}

type TagCreationAttributes = Omit<TagAttributes, 'id'>;

export interface TagInstance extends Model<TagAttributes, TagCreationAttributes>, TagAttributes {}

const Tag = sequelize.define<TagInstance>('tag', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Tag;
