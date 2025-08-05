import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface FileToSkillVersionAttributes {
  id: string;
  skillVersionId: string;
  fileId: string;
  creationAt?: Date;
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
	}
});

export default FileToSkillVersion;
