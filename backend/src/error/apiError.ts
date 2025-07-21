import {ErrorKeys, API_ERROR} from '../constants/errors';

export class ApiError extends Error {
	code: number;
	type: string;
	description: string;
	constructor(code: number, description: string, type: string) {
		super();
		this.code = code;
		this.type = type;
		this.description = description;
	}

	static errorByType(type: ErrorKeys){
		const error = API_ERROR[type];
		return new ApiError(error.code, error.description, error.type);
	}

}
