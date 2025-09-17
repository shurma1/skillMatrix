/**
 * @openapi
 * components:
 *   schemas:
 *     TokenDTO:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *     RefreshRequestDTO:
 *       type: object
 *       required: [refreshToken]
 *       properties:
 *         refreshToken:
 *           type: string
 */
export class TokenDTO {
	accessToken: string;
	refreshToken: string;

	constructor(
		accessToken: string,
		refreshToken: string,
	) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}

}
