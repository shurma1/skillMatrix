import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface JobRoleToSkillsAttributes {
  id: string;
  targetLevel: number;
  jobRoleId: string;
  skillId: string;
}

type JobRoleToSkillsCreationAttributes = Omit<JobRoleToSkillsAttributes, 'id'>;

export interface JobRoleToSkillsInstance extends Model<JobRoleToSkillsAttributes, JobRoleToSkillsCreationAttributes>, JobRoleToSkillsAttributes {}

const JobRoleToSkills = sequelize.define<JobRoleToSkillsInstance>('jobRoleToSkills', {
	id: {
		type: DataTypes.UUID,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	targetLevel: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	jobRoleId: {
		type: DataTypes.UUID,
		allowNull: false,
	},
	skillId: {
		type: DataTypes.UUID,
		allowNull: false,
	},
});

export default JobRoleToSkills;
