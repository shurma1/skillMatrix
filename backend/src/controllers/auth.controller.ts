import { Request, Response, NextFunction } from 'express';
import AuthService from "../services/auth.service";
import TokenService from "../services/token.service";
import { isDev } from '../index';

// Настройки куки для разных окружений
const getCookieOptions = () => ({
	httpOnly: true,
	secure: false,
	sameSite: 'lax' as const,
	...(isDev && { domain: 'localhost' }),
});

class AuthController {
	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { identifier, password } = req.body;

			const authDTO = await AuthService.login(identifier, password);
			
			res.cookie('refreshToken', authDTO.refreshToken, getCookieOptions());
			
			res.json(authDTO);
		} catch (err) {
			next(err);
		}
	}

	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const { refreshToken } = req.cookies;
			
			if (!refreshToken) {
				return res.status(401).json({ message: 'Refresh token not found in cookies' });
			}
			
			const tokens = await AuthService.refresh(refreshToken);
			
			res.cookie('refreshToken', tokens.refreshToken, getCookieOptions());
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
			res.clearCookie('refreshToken', getCookieOptions());
			res.json({ success: true });
		} catch (err) {
			next(err);
		}
	}
}

export default new AuthController();
