const API_ERROR = {
	NO_FILE_UPLOADED: {
		type: 'NO_FILE_UPLOADED',
		description: 'The file was not uploaded.',
		code: 400,
	},
	MIME_TYPE_NOT_SUPPORTED: {
		type: 'MIME_TYPE_NOT_SUPPORTED',
		description: 'The mime type of the uploaded file is not supported.',
		code: 500,
	},
	FAILED_TO_LOAD_FILE: {
		type: 'FAILED_TO_LOAD_FILE',
		description: 'An error occurred while uploading the file.',
		code: 500,
	},
	FILE_NOT_FOUND: {
		type: 'FILE_NOT_FOUND',
		description: 'The file has not been found.',
		code: 404,
	}
};

type ErrorKeys = keyof typeof API_ERROR;

export {
	API_ERROR,
	ErrorKeys
};
