import {NextFunction, Request, Response} from "express";
import PermissionService from "../services/permission.service";

class PermissionController {
	async getMe(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.authUser!.id;
			
			const permissions = await PermissionService.getByUser(userId)
			res.send(permissions);
		} catch (err) {
			next(err);
		}
	}
	
	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const permissions = await PermissionService.getAll()
			res.send(permissions);
		} catch (err) {
			next(err);
		}
	}
}

export default new PermissionController()
