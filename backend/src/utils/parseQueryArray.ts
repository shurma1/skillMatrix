export const parseQueryArray = (param: string): string[] => {
	if (!param) return [];
	
	return param
		.split(',')
		.map(item => item.trim())
		.filter(item => item !== '');
};
