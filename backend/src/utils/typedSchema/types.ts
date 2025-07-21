import {
	BailOptions,
	OptionalOptions,
	ResultWithContext,
	Sanitizers, ValidationChain,
	ValidationChainLike,
	Validators
} from 'express-validator/src/chain';
import {ErrorKeys} from '../../constants/Errors';
import {CustomSanitizer, CustomValidator, FieldMessageFactory} from 'express-validator';

declare type BaseValidatorSchemaOptions = {
	errorMessage?: ErrorKeys;
	negated?: boolean;
	bail?: boolean | BailOptions;
	if?: CustomValidator | ValidationChain;
};
declare type ValidatorSchemaOptions<K extends keyof Validators<any>> = boolean | (BaseValidatorSchemaOptions & {
	options?: Parameters<Validators<any>[K]> | Parameters<Validators<any>[K]>[0];
});
declare type CustomValidatorSchemaOptions = BaseValidatorSchemaOptions & {
	custom: CustomValidator;
};
export declare type ValidatorsSchema = {
	[K in Exclude<keyof Validators<any>, 'not' | 'withMessage'>]?: ValidatorSchemaOptions<K>;
};
declare type SanitizerSchemaOptions<K extends keyof Sanitizers<any>> = boolean | {
	options?: Parameters<Sanitizers<any>[K]> | Parameters<Sanitizers<any>[K]>[0];
};
declare type CustomSanitizerSchemaOptions = {
	customSanitizer: CustomSanitizer;
};
export declare type SanitizersSchema = {
	[K in keyof Sanitizers<any>]?: SanitizerSchemaOptions<K>;
};
type BaseParamSchema = {
	errorMessage?: FieldMessageFactory | string;
	optional?: boolean | {
		options?: OptionalOptions;
	};
};
export declare type DefaultSchemaKeys = keyof BaseParamSchema | keyof ValidatorsSchema | keyof SanitizersSchema;

export declare type ParamSchema<T extends string = DefaultSchemaKeys> = BaseParamSchema & ValidatorsSchema & SanitizersSchema & {
	[K in T]?: K extends keyof BaseParamSchema ? BaseParamSchema[K] : K extends keyof ValidatorsSchema ? ValidatorsSchema[K] : K extends keyof SanitizersSchema ? SanitizersSchema[K] : CustomValidatorSchemaOptions | CustomSanitizerSchemaOptions;
};

export declare type Params<T extends string = DefaultSchemaKeys> = ParamSchema<T>;
export declare type Schema<T extends string = DefaultSchemaKeys> = Record<string, ParamSchema<T>>;

export declare type RunnableValidationChains<C extends ValidationChainLike> = C[] & {
	run(req: Request): Promise<ResultWithContext[]>;
};

export declare function createCheckSchema<C extends ValidationChainLike>(createChain: (fields?: string | string[], locations?: Location[], errorMessage?: any) => C, extraValidators?: (keyof C)[], extraSanitizers?: (keyof C)[]): <T extends string = DefaultSchemaKeys>(schema: Schema<T>, defaultLocations?: Location[]) => RunnableValidationChains<C>;

