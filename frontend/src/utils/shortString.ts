const MAX_LENGTH = 50;
const LEFT_PART_LENGTH = 20;
const RIGHT_PART_LENGTH = 20;

export const shortString = (str?: string) => {
	if(!str) return '';
	
	if(str.length <= MAX_LENGTH) return str;
	
	const leftPart = str.slice(0, LEFT_PART_LENGTH);
	const rightPart = str.slice(str.length - RIGHT_PART_LENGTH, str.length);
	
	return `${leftPart}...${rightPart}`
}
