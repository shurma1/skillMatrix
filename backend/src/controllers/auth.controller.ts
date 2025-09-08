import { Request, Response, NextFunction } from 'express';
import AuthService from "../services/auth.service";
import TokenService from "../services/token.service";

class AuthController {
	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { identifier, password } = req.body;

			const authDTO = await AuthService.login(identifier, password);
			
			res.cookie('refreshToken', authDTO.refreshToken, {
				httpOnly: true,
				secure: false,
				sameSite: 'lax',
				domain: 'localhost',
			});
			
			res.json(authDTO);
		} catch (err) {
			next(err);
		}
	}

	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;
			
			const tokens = await AuthService.refresh(refreshToken);
			
			res.cookie('refreshToken', tokens.refresh_token, {
				httpOnly: true,
				secure: false,
				sameSite: 'lax'
			});
			res.json(tokens);
		} catch (err) {
			next(err);
		}
	}

	async logout(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;
			if (refreshToken) {
				await TokenService.RemoveToken(refreshToken);
			}
			// Очищаем куку (должны совпасть опции с установкой)
			res.clearCookie('refreshToken', {
				httpOnly: true,
				secure: false,
				sameSite: 'lax',
				domain: 'localhost'
			});
			res.json({ success: true });
		} catch (err) {
			next(err);
		}
	}
}

export default new AuthController();
