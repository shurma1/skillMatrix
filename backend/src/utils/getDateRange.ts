export const getDateRange = (dates?: Date[]) => {
	if (!dates || dates.length === 0) return [null, null];
	if (dates.length === 1) {
		const start = new Date(dates[0]);
		start.setHours(0, 0, 0, 0);
		const end = new Date(dates[0]);
		end.setHours(23, 59, 59, 999);
		return [start, end];
	}
	const start = new Date(dates[0]);
	start.setHours(0, 0, 0, 0);
	const end = new Date(dates[1]);
	end.setHours(23, 59, 59, 999);
	return [start, end];
}
