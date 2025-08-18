import Permission from '../models/entities/Permission';
import {UserToPermission} from "../models";

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
}

export default new PermissionRepository();
