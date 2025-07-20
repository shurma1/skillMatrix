import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface UserToJobRoleAttributes {
  id: string;
  userId: string;
  jobId: string;
}

type UserToJobRoleCreationAttributes = Omit<UserToJobRoleAttributes, 'id'>;

export interface UserToJobRoleInstance extends Model<UserToJobRoleAttributes, UserToJobRoleCreationAttributes>, UserToJobRoleAttributes {}

const UserToJobRole = sequelize.define<UserToJobRoleInstance>('userToJobRole', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

export default UserToJobRole;
