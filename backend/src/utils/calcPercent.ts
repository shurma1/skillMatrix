export const calcPercent = (a: number, b: number, round: boolean = true) => {
	if(a === 0 || b === 0 ) {
		return 0;
	}
	
	const percent = b / a * 100;
	return round ? Math.round(percent) : percent;
}
