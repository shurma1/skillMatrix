const API_ERROR = {
	NO_FILE_UPLOADED: {
		type: 'NO_FILE_UPLOADED',
		description: 'The file was not uploaded.',
		code: 400,
	},
	MIME_TYPE_NOT_SUPPORTED: {
		type: 'MIME_TYPE_NOT_SUPPORTED',
		description: 'The mime type of the uploaded file is not supported.',
		code: 415,
	},
	FAILED_TO_LOAD_FILE: {
		type: 'FAILED_TO_LOAD_FILE',
		description: 'An error occurred while uploading the file.',
		code: 500,
	},
	FILE_NOT_FOUND: {
		type: 'FILE_NOT_FOUND',
		description: 'The file has not been found.',
		code: 400,
	},
	USER_NOT_FOUND: {
		type: 'USER_NOT_FOUND',
		description: 'The user has not been found.',
		code: 404,
	},
	USER_ALREADY_EXISTS: {
		type: 'USER_ALREADY_EXISTS',
		description: 'Еhe user already exists.',
		code: 400,
	},
	INVALID_PASSWORD_LENGTH: {
		type: 'INVALID_PASSWORD_LENGTH',
		description: 'The password must be longer than 8 characters and shorter than 100.',
		code: 400,
	},
	JOBROLE_NOT_FOUND: {
		type: 'JOBROLE_NOT_FOUND',
		description: 'The job role has not been found.',
		code: 404,
	},
	IMAGE_NOT_FOUND: {
		type: 'IMAGE_NOT_FOUND',
		description: 'Image not found.',
		code: 404,
	},
	INVALID_UUID: {
		type: 'INVALID_UUID',
		description: 'UUID is invalid',
		code: 400,
	},
	INVALID_DATA: {
		type: 'INVALID_DATA',
		description: 'Invalid data',
		code: 400,
	},
	JOB_ALREADY_EXIST: {
		type: 'JOB_ALREADY_EXIST',
		description: 'Job with this title already exist.',
		code: 400,
	},
	SKILL_NOT_FOUND: {
		type: 'SKILL_NOT_FOUND',
		description: 'The skill has not been found.',
		code: 404,
	},
	SKILL_VERSION_NOT_FOUND: {
		type: 'SKILL_VERSION_NOT_FOUND',
		description: 'The skill version has not been found.',
		code: 404,
	},
	USER_ALREADY_HAS_THIS_SKILL: {
		type: 'USER_ALREADY_HAS_THIS_SKILL',
		description: 'The user already has this skill.',
		code: 400,
	},
	USER_HAS_NOT_THIS_SKILL: {
		type: 'USER_HAS_NOT_THIS_SKILL',
		description: 'The user hasnt this skill.',
		code: 400,
	},
	USER_ALREADY_HAS_THIS_JOBROLE: {
		type: 'USER_ALREADY_HAS_THIS_JOBROLE',
		description: 'The user already has this job role.',
		code: 400,
	},
	INVALID_CONFIRM_TYPE: {
		type: 'INVALID_CONFIRM_TYPE',
		description: 'The confirm type is invalid.',
		code: 400,
	},
	JOB_ALREADY_HAS_THIS_SKILL: {
		type: 'JOB_ALREADY_HAS_THIS_SKILL',
		description: 'The job already has this skill.',
		code: 400,
	},
	JOB_ALREADY_HASNT_THIS_SKILL: {
		type: 'JOB_ALREADY_HASNT_THIS_SKILL',
		description: 'The job already hasnt this skill.',
		code: 400,
	},
	TEST_ALREADY_PASSED: {
		type: 'TEST_ALREADY_PASSED',
		description: 'The test has already been passed',
		code: 400,
	},
	TAG_NOT_FOUND: {
		type: 'TAG_NOT_FOUND',
		description: 'The tag not found.',
		code: 404,
	},
	TAG_ALREADY_ADDED: {
		type: 'TAG_ALREADY_ADDED',
		description: 'The tag already added to skill.',
		code: 400,
	},
	SCORE_CANNOT_BE_MORE_THAN_QUESTION_LENGTH: {
		type: 'SCORE_CANNOT_BE_MORE_THAN_QUESTION_LENGTH',
		description: 'The score cannot be more than the number of questions.',
		code: 400,
	},
	TEST_ALREADY_EXISTS: {
		type: 'TEST_ALREADY_EXISTS',
		description: 'Test was been already created.',
		code: 400,
	},
	TEST_NOT_FOUND: {
		type: 'TEST_NOT_FOUND',
		description: 'Test not found.',
		code: 404,
	},
	SESSION_NOT_FOUND: {
		type: 'SESSION_NOT_FOUND',
		description: 'Session not found.',
		code: 404,
	},
	INVALID_ACCESS_TOKEN: {
		type: 'INVALID_ACCESS_TOKEN',
		description: 'The access token is invalid.',
		code: 401,
	},
	INVALID_REFRESH_TOKEN: {
		type: 'INVALID_REFRESH_TOKEN',
		description: 'The refresh token is invalid.',
		code: 401,
	},
	INVALID_AUTHORIZATION_DATA: {
		type: 'INVALID_AUTHORIZATION_DATA',
		description: 'Email, login or password are invalid.',
		code: 400,
	},
	PERMISSION_DENIED: {
		type: 'PERMISSION_DENIED',
		description: 'You don\'t have enough permissions.',
		code: 403,
	},
	INVALID_DATE: {
		type: 'INVALID_DATE',
		description: 'Date is invalid.',
		code: 400,
	},
	PERMISSION_ALREADY_EXISTS: {
		type: 'PERMISSION_ALREADY_EXISTS',
		description: 'Permission already exists.',
		code: 400,
	},
	PERMISSION_NOT_FOUND: {
		type: 'PERMISSION_NOT_FOUND',
		description: 'Permission not found.',
		code: 400,
	},
	ALREADY_CONFIRM: {
		type: 'ALREADY_CONFIRM',
		description: 'The skill already confirm',
		code: 400,
	},
	
};

type ErrorKeys = keyof typeof API_ERROR;

export {
	API_ERROR,
	ErrorKeys
};
