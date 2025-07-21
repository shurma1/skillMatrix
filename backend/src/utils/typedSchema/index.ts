import {Schema as outputSchema} from 'express-validator';
import {Params, Schema} from './types';


export const typedSchema = (schema: Schema): outputSchema => {
	return schema;
};

export const typedParam = (field: Params): Params => {
	return field;
};