import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface ImageAttributes {
  id: string;
  width: number;
  height: number;
  filename: string;
  thumbnailFilename: string;
  mimeType: string;
}

type ImageCreationAttributes = Omit<ImageAttributes, 'id'>;

export interface ImageInstance extends Model<ImageAttributes, ImageCreationAttributes>, ImageAttributes {}

const Image = sequelize.define<ImageInstance>('image', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnailFilename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Image;
