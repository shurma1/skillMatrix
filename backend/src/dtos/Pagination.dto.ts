
export class PaginationDTO<T> {
	count: number;
	rows: T[];
	
	constructor(count: number, rows: T[]) {
		this.count = count;
		this.rows = rows;
	}
}
