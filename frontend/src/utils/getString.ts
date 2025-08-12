import {type StringKey, strings} from '@/assets/strings.ts';

export const getString = (stringKey: StringKey) => {
	return strings[stringKey];
};
