import PermissionRepository from "../repositories/permission.repository";
import UserService from "./user.service";
import {ApiError} from "../error/apiError";

class PermissionService {
	async create(name: string, description: string) {
		const isPermissionExist = await PermissionRepository.getByName(name);
		
		if(isPermissionExist) {
			throw ApiError.errorByType('PERMISSION_ALREADY_EXISTS')
		}
		
		await PermissionRepository.create(name, description);
	}
	async add(userId: string, permissionId: string) {
		await UserService.checkIsUserExist(userId);
		await this.checkIsPermissionExist(permissionId);
		
		await PermissionRepository.add(userId, permissionId);
	}
	
	async getAll() {
		return await PermissionRepository.getAll();
	}
	
	async checkIsPermissionExist(permissionId: string) {
		const permission =  await PermissionRepository.getByID(permissionId);
		
		if(! permission) {
			throw ApiError.errorByType('PERMISSION_NOT_FOUND');
		}
	}
}

export default new PermissionService();
