import { Request, Response, NextFunction } from 'express';
import AuthService from "../services/auth.service";

class AuthController {
	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { identifier, password } = req.body;

			const authDTO = await AuthService.login(identifier, password);

			res.json(authDTO);
		} catch (err) {
			next(err);
		}
	}

	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;
			
			const tokens = await AuthService.refresh(refreshToken);
			
			res.json(tokens);
		} catch (err) {
			next(err);
		}
	}
}

export default new AuthController();
