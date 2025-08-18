import {
	ValidationChain,
	Location,
} from 'express-validator';
import {ErrorKeys} from '../../constants/errors';
import {CustomSanitizer, CustomValidator, FieldMessageFactory} from 'express-validator';

// Упрощенные типы для совместимости
type BaseValidatorSchemaOptions = {
	errorMessage?: ErrorKeys;
	negated?: boolean;
	bail?: boolean;
	if?: CustomValidator | ValidationChain;
};

// Базовые типы для схем
type BaseParamSchema = BaseValidatorSchemaOptions;
type ValidatorsSchema = Record<string, any>;
type SanitizersSchema = Record<string, any>;

export type DefaultSchemaKeys = string;
export type BaseOptionalSanitizer = CustomSanitizer;
export type BaseOptionalValidator = CustomValidator;
export type BaseOptionalSanitizerOptions = {
	nullable?: boolean;
	checkFalsy?: boolean;
};
export type BaseOptionalValidatorOptions = BaseOptionalSanitizerOptions;
export type BaseSanitizerOptions = {
	errorMessage?: FieldMessageFactory | string;
	nullable?: boolean;
	checkFalsy?: boolean;
};
export type OptionalOptions = BaseOptionalValidatorOptions;
export type ResultWithContext = any;
export type BailOptions = any;
export type Validators = Record<string, any>;
export type Sanitizers = Record<string, any>;

export type ParamSchema<T extends string = DefaultSchemaKeys> = BaseParamSchema & ValidatorsSchema & SanitizersSchema & {
	optional?: true | BaseOptionalValidatorOptions;
};

export type Params<T extends string = DefaultSchemaKeys> = ParamSchema<T>;
export type Schema<T extends string = DefaultSchemaKeys> = Record<string, ParamSchema<T>>;

export interface RunnableValidationChains<C extends ValidationChain> {
	run(req: any, options?: any): Promise<any>;
}

export function createCheckSchema<C extends ValidationChain>(createChain: any, extraValidators?: any, extraSanitizers?: any): <T extends string = DefaultSchemaKeys>(schema: Schema<T>, defaultLocations?: Location[]) => RunnableValidationChains<C> {
	// Заглушка для функции
	return () => ({
		run: async () => []
	}) as any;
}
