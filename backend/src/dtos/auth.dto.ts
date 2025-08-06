import { TokenDTO } from './token.dto';
import { UserDTO } from './user.dto';

export class AuthDTO {
	public accessToken: string;
	public refreshToken: string;
	public user: UserDTO;

	constructor(tokens: TokenDTO, user: UserDTO) {
		this.accessToken = tokens.access_token;
		this.refreshToken = tokens.refresh_token;
		this.user = user;
	}
}
