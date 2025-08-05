import { typedParam, typedSchema } from '../../utils/typedSchema';

export const updateUser = () =>
	typedSchema({
		login: typedParam({
			optional: true,
			isString: { errorMessage: 'INVALID_DATA' },
			notEmpty: { errorMessage: 'INVALID_DATA' },
		}),
		firstname: typedParam({
			optional: true,
			isString: { errorMessage: 'INVALID_DATA' },
			notEmpty: { errorMessage: 'INVALID_DATA' },
		}),
		lastname: typedParam({
			optional: true,
			isString: { errorMessage: 'INVALID_DATA' },
			notEmpty: { errorMessage: 'INVALID_DATA' },
		}),
		patronymic: typedParam({
			optional: true,
			isString: { errorMessage: 'INVALID_DATA' },
			notEmpty: { errorMessage: 'INVALID_DATA' },
		}),
		password: typedParam({
			optional: true,
			isString: { errorMessage: 'INVALID_DATA' },
			notEmpty: { errorMessage: 'INVALID_DATA' },
		}),
		avatar_id: typedParam({
			optional: true,
			custom: {
				options: (value: unknown) => value === null || (typeof value === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value)),
				errorMessage: 'INVALID_UUID',
			},
		}),
		email: typedParam({
			optional: true,
			isEmail: { errorMessage: 'INVALID_DATA' },
		}),
	});
