import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface FileAttributes {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  creationAt: Date;
  path: string;
}

type FileCreationAttributes = Omit<FileAttributes, 'id'>;

export interface FileInstance extends Model<FileAttributes, FileCreationAttributes>, FileAttributes {}

const File = sequelize.define<FileInstance>('file', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  creationAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default File;
