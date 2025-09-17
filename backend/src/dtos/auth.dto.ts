import { TokenDTO } from './token.dto';
import { UserDTO } from './user.dto';

/**
 * @openapi
 * components:
 *   schemas:
 *     LoginRequestDTO:
 *       type: object
 *       required: [identifier, password]
 *       properties:
 *         identifier:
 *           type: string
 *           description: Login or email
 *         password:
 *           type: string
 *     AuthDTO:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/UserDTO'
 */
export class AuthDTO {
	public accessToken: string;
	public refreshToken: string;
	public user: UserDTO;

	constructor(tokens: TokenDTO, user: UserDTO) {
		this.accessToken = tokens.accessToken;
		this.refreshToken = tokens.refreshToken;
		this.user = user;
	}
}
