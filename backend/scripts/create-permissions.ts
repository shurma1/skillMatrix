import {Logger} from "../src/utils/logger";
import PermissionService from "../src/services/permission.service";
import {PERMISSIONS} from "../src/constants/permissons";


const start = async () => {
	Logger.log('Creating permissions');
	const permissionKeys = Object.keys(PERMISSIONS);
	
	permissionKeys.map(async key => {
		try{
			Logger.log('Creating ' + PERMISSIONS[key].key + ' permissions');
			await PermissionService.create(PERMISSIONS[key].key, PERMISSIONS[key].name)
		}
		catch (error) {
			Logger.error('Failed to create ' + PERMISSIONS[key].key + ' permission: ');
		}
	})
	
	Logger.log('Success!');
}

start()
