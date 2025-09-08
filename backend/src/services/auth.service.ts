import {ApiError} from "../error/apiError";
import UserRepossitory from "../repositories/user.repossitory";
import bcrypt from "bcrypt";
import TokenService from "./token.service";
import {AuthDTO} from "../dtos/auth.dto";
import {UserDTO} from "../dtos/user.dto";
import UserService from "./user.service";

class AuthService {
	async login(identifier: string, password: string): Promise<AuthDTO> {
		
		const isIdentifierEmail = identifier.includes('@');
		
		const user = isIdentifierEmail
			? await UserRepossitory.getUserByEmail(identifier)
			: await UserRepossitory.getByLogin(identifier)
		
		if(! user) {
			throw ApiError.errorByType('INVALID_AUTHORIZATION_DATA');
		}
		
		const isPasswordValid = await bcrypt.compare(password, user.password_hash);
		
		if(! isPasswordValid) {
			throw ApiError.errorByType('INVALID_AUTHORIZATION_DATA');
		}
		
		const tokensDto = TokenService.GenerateTokens({ userId: user.id });
		await TokenService.SaveToken(user.id, tokensDto.refresh_token);
		
		const userDto = new UserDTO(user.id, user.login, user.firstname, user.lastname, user.patronymic, user.avatar_id, user.email);
		
		return new AuthDTO(tokensDto, userDto);
	}
	
	async refresh(refreshToken: string) {
		const userData = TokenService.ValidateRefreshToken(refreshToken);
		const tokenFromDb = await TokenService.FindToken(refreshToken);
		
		if (!userData || !tokenFromDb) {
			throw ApiError.errorByType('INVALID_REFRESH_TOKEN');
		}
		
		const user = await UserService.getByID(userData.userId);
		
		if (!user) {
			throw ApiError.errorByType('USER_NOT_FOUND');
		}
		
		// Генерируем новую пару токенов и просто перезаписываем token в БД (SaveToken делает upsert логики)
		// Удаление старого токена (RemoveToken) создаёт окно гонки при параллельных refresh запросах,
		// что приводит к INVALID_REFRESH_TOKEN для второго запроса. Поэтому мы не удаляем отдельно старый.
		const tokens = TokenService.GenerateTokens({ userId: user.id });
		await TokenService.SaveToken(user.id, tokens.refresh_token);
		return tokens;
	}
}

export default new AuthService();
