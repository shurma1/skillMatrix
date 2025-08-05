import { typedParam, typedSchema } from '../../utils/typedSchema';


export const checkID = () =>
	typedSchema({
		id: typedParam({
			isUUID: { errorMessage: 'INVALID_UUID' },
			notEmpty: { errorMessage: 'INVALID_UUID' },
		}),
	});
