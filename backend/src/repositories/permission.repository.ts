import Permission from '../models/entities/Permission';

class PermissionRepository {
	async create(name: string, description: string) {
		return await Permission.create({name, description});
	}
	async getByID(id: string) {
		return await Permission.findOne({ where: { id } });
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
}

export default new PermissionRepository();
