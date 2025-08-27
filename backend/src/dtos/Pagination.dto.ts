/**
 * @openapi
 * components:
 *   schemas:
 *     PaginationDTO:
 *       type: object
 *       properties:
 *         count: { type: integer }
 *         rows:
 *           type: array
 *           items:
 *             type: object
 */
export class PaginationDTO<T> {
	count: number;
	rows: T[];
	
	constructor(count: number, rows: T[]) {
		this.count = count;
		this.rows = rows;
	}
}
