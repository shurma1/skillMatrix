import {NextFunction, Request, Response} from 'express';
import {ApiError} from '../error/apiError';
import {checkSchema, Schema} from 'express-validator';
import {ErrorKeys} from '../constants/errors';

interface IError{
	type: string,
	value: any,
	msg: ErrorKeys,
	path: string,
	location: string

}

type Locations = 'body' | 'cookies' | 'headers' | 'params' | 'query';

export const validateSchema = (schema: Schema, locations: Locations[] = ['body']) => async( req: Request, res: Response, next: NextFunction) => {

	const validations = await checkSchema(schema, locations).run(req);

	const errors: IError[] = [];


	for( const validation of validations) {

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		(validation.errors as IError[]).forEach(error => errors.push(error));
	}

	if(! errors.length){
		next();
		return;
	}

	const mainError = errors[0];

	next(ApiError.errorByType(mainError.msg));
};
