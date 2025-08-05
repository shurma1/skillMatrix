import {parseQueryArray} from "./parseQueryArray";

export const parseQueryDates = (dateString: string): Date[] => {
	if (!dateString) return [];
	
	const dateCandidates = parseQueryArray(dateString);
	const validDates: Date[] = [];

	for (const dateStr of dateCandidates) {
		if (validDates.length >= 2) break;
		
		const date = new Date(dateStr);
		if (!isNaN(date.getTime())) {
			validDates.push(date);
		}
	}
	
	return validDates;
};
