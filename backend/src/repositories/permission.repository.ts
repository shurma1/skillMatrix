// import Permission from '../models/entities/Permission';
//
// class PermissionRepository {
// 	async create(data: any) {
// 		return await Permission.create(data);
// 	}
// 	async getByID(id: string) {
// 		return await Permission.findOne({ where: { id } });
// 	}
// 	async update(id: string, data: any) {
// 		const instance = await this.getByID(id);
// 		if (!instance) return false;
// 		Object.assign(instance, data);
// 		await instance.save();
// 		return instance;
// 	}
// 	async delete(id: string) {
// 		const deletedCount = await Permission.destroy({ where: { id } });
// 		return deletedCount > 0;
// 	}
// }
//
// export default new PermissionRepository();
