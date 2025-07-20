import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface JobRoleAttributes {
  id: string;
  title: string;
}

type JobRoleCreationAttributes = Omit<JobRoleAttributes, 'id'>;

export interface JobRoleInstance extends Model<JobRoleAttributes, JobRoleCreationAttributes>, JobRoleAttributes {}

const JobRole = sequelize.define<JobRoleInstance>('jobRole', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default JobRole;
