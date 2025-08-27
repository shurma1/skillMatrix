export function sumByColumns(matrix: number[][]): number[] {
	if (matrix.length === 0) return [];
	
	const cols = matrix[0].length;
	const result = Array(cols).fill(0);
	
	for (const row of matrix) {
		for (let j = 0; j < cols; j++) {
			result[j] += row[j];
		}
	}
	
	return result;
}


export function transpose<T>(matrix: T[][]): T[][] {
	if (matrix.length === 0) return [];
	
	const rows = matrix.length;
	const cols = matrix[0].length;
	
	// Создаем новую матрицу с обратными размерами
	const result: T[][] = Array.from({ length: cols }, () => new Array(rows));
	
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			result[j][i] = matrix[i][j];
		}
	}
	
	return result;
}


export function sumMatrix(matrix: number[][]) {
	return matrix.reduce((sum, row) => {
		return sum + row.reduce((rowSum, value) => rowSum + value, 0);
	}, 0);
}
