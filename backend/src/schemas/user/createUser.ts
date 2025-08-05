import { typedParam, typedSchema } from '../../utils/typedSchema';


export const createUser = () =>
	typedSchema({
		login: typedParam({
			isString: { errorMessage: 'INVALID_DATA' },
			notEmpty: { errorMessage: 'INVALID_DATA' },
		}),
		firstname: typedParam({
			isString: { errorMessage: 'INVALID_DATA' },
			notEmpty: { errorMessage: 'INVALID_DATA' },
		}),
		lastname: typedParam({
			isString: { errorMessage: 'INVALID_DATA' },
			notEmpty: { errorMessage: 'INVALID_DATA' },
		}),
		patronymic: typedParam({
			isString: { errorMessage: 'INVALID_DATA' },
			notEmpty: { errorMessage: 'INVALID_DATA' },
		}),
		password: typedParam({
			isString: { errorMessage: 'INVALID_DATA' },
			notEmpty: { errorMessage: 'INVALID_DATA' },
		}),
		avatar_id: typedParam({
			optional: true,
			isUUID: { errorMessage: 'INVALID_UUID' },
		}),
		email: typedParam({
			optional: true,
			isEmail: { errorMessage: 'INVALID_DATA' },
		}),
	});
