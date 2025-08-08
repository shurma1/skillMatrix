/**
 * @openapi
 * components:
 *   schemas:
 *     TokenDTO:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *         refresh_token:
 *           type: string
 *     RefreshRequestDTO:
 *       type: object
 *       required: [refresh_token]
 *       properties:
 *         refresh_token:
 *           type: string
 */
export class TokenDTO {
	access_token: string;
	refresh_token: string;

	constructor(
		access_token: string,
		refresh_token: string,
	) {
		this.access_token = access_token;
		this.refresh_token = refresh_token;
	}

}
