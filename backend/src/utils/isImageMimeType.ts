const imageMimeTypes = [
	'image/jpeg', // .jpg, .jpeg
	'image/png', // .png
	'image/webp', // .webp
	'image/heif', // .heif, .heic
];

export const isImageMimeType = (mimeType: string) => {
	return imageMimeTypes.includes(mimeType);
}
