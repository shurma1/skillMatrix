import {NextFunction, Request, Response} from 'express';
import {ApiError} from '../error/apiError';
import {Logger} from "../utils/logger";

const errorHandlingMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
	Logger.error(err);
	if(err instanceof ApiError){
		return res.status(err.code).json({
			type: err.type,
			description: err.description,
			code: err.code,
		});
	}

	res.status(500).json({
		type: 'UNKNOWN_ERROR',
		description: 'Неизвестаня ошибка',
		code: 500,
	});
};

export {
	errorHandlingMiddleware
};
