import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface FileToSkillVersionAttributes {
  id: string;
  skillVersionId: string;
  fileId: string;
  creationAt: Date;
  version: number;
  isCurrent: boolean;
}

type FileToSkillVersionCreationAttributes = Omit<FileToSkillVersionAttributes, 'id'>;

export interface FileToSkillVersionInstance extends Model<FileToSkillVersionAttributes, FileToSkillVersionCreationAttributes>, FileToSkillVersionAttributes {}

const FileToSkillVersion = sequelize.define<FileToSkillVersionInstance>('fileToSkillVersion', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  skillVersionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  fileId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  creationAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isCurrent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

export default FileToSkillVersion;
