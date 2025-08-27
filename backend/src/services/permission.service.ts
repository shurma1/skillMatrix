import PermissionRepository from "../repositories/permission.repository";
import UserService from "./user.service";
import {ApiError} from "../error/apiError";
import {PermissionDto} from "../dtos/Permission.dto";
import {PERMISSIONS} from "../constants/permissons";

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
		const permissions =  await PermissionRepository.getAll();
		
		return permissions.filter(permission => permission.name !== 'PERMISSION_MANAGE')
	}
	
	async deleteFormUser(userId: string, permissionId: string) {
		await UserService.checkIsUserExist(userId);
		await this.checkIsPermissionExist(permissionId);
		
		return await PermissionRepository.deleteFromUser(userId, permissionId);
	}
	
	async getByUser(userId: string) {
		await UserService.checkIsUserExist(userId);
		
		const permissions = await PermissionRepository.getByUserId(userId);
		
		return permissions.map(permission => new PermissionDto(permission.id, permission.name, permission.description));
	}
	
	async checkIsPermissionExist(permissionId: string) {
		const permission =  await PermissionRepository.getByID(permissionId);
		
		if(! permission) {
			throw ApiError.errorByType('PERMISSION_NOT_FOUND');
		}
	}
}

export default new PermissionService();
