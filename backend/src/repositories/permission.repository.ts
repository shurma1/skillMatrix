import Permission, {PermissionInstance} from '../models/entities/Permission';
import {User, UserToPermission} from "../models";
import {UserInstance} from "../models/entities/User";

class PermissionRepository {
	async create(name: string, description: string) {
		return await Permission.create({name, description});
	}
	async getByID(id: string) {
		return await Permission.findOne({ where: { id } });
	}
	
	async getAll() {
		return await Permission.findAll();
	}
	
	async getByName(name: string) {
		return await Permission.findOne({ where: { name } });
	}
	async update(id: string, name: string) {
		return await Permission.update({name}, {where: {id}});
	}
	async delete(id: string) {
		const deletedCount = await Permission.destroy({ where: { id } });
		return deletedCount > 0;
	}
	
	async add(userId: string, permissionId: string) {
		await UserToPermission.create({userId, permissionId});
	}
	
	async deleteFromUser(userId: string, permissionId: string) {
		await UserToPermission.destroy({ where: {userId, permissionId}});
	}
	
	async getByUserId(userId: string) {
		const userWithPermissions = await User.findOne({
			where: { id: userId },
			include: [{
				model: Permission,
			}]
		}) as UserInstance & {permissions: PermissionInstance[]};
		
		if (!userWithPermissions) {
			return [];
		}
		
		return userWithPermissions.permissions;
	}
}

export default new PermissionRepository();
