import UserService from "../src/services/user.service";
import {Logger} from "../src/utils/logger";
import PermissionService from "../src/services/permission.service";


const start = async () => {
	let adminUser;
	try{
		adminUser = await UserService.create({
			login: 'test',
			firstname: 'Иван',
			lastname: 'Иванов',
			patronymic: 'Иванович',
			password: '1234567890'
		});
	}
	catch{
		Logger.error('Failed to create admin user: ');
		return;
	}
	
	Logger.log('Created new ADMIN user test:1234567890');
	Logger.log('Adding permissions...');
	
	const permissions = await PermissionService.getAll();
	
	const permissionNames = permissions.map(permission => permission.name).join(", ");
	
	Logger.log('Founded ' + permissions.length + ' permissions: ' + permissionNames);
	
	await Promise.all(
		permissions.map(async permission => {
			Logger.log('Adding ' + permission.name);
			try{
				await PermissionService.add(adminUser.id, permission.id);
			}
			catch (error) {
				Logger.error('Failed to add permission ' + permission.name + ': ' + "Already exists");
			}
		})
	)
	
	Logger.log('Success!');
	
}

start()
