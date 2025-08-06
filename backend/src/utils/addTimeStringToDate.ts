import { parseTimeString } from './parseTimeString';

export function addTimeToCurrentDate(date: Date, timeStr: string) {
	const { value, unit } = parseTimeString(timeStr);

	switch (unit.toUpperCase()) {
	case 'D':
		date.setDate(date.getDate() + value);
		break;
	case 'H':
		date.setHours(date.getHours() + value);
		break;
	case 'M':
		date.setMinutes(date.getMinutes() + value);
		break;
	case 'S':
		date.setSeconds(date.getSeconds() + value);
		break;
	default:
		throw new Error('Неизвестная единица времени. Используйте D, h, m или s.');
	}

	return date;
}
