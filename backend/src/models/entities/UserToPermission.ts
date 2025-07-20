import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

interface UserToPermissionAttributes {
  id: string;
  permissionId: string;
  userId: string;
}

type UserToPermissionCreationAttributes = Omit<UserToPermissionAttributes, 'id'>;

export interface UserToPermissionInstance extends Model<UserToPermissionAttributes, UserToPermissionCreationAttributes>, UserToPermissionAttributes {}

const UserToPermission = sequelize.define<UserToPermissionInstance>('userToPermission', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  permissionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

export default UserToPermission;
