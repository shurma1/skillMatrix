import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

//костыль
const isDev = process.env.npm_lifecycle_script!.includes('mode=development');

const uploadPath = isDev ? '../../uploads' : '../../../uploads';
const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		cb(null, path.resolve(__dirname, uploadPath));
	},
	filename: function (_req, file, cb) {
		const ext = path.extname(file.originalname);
		const uuid = uuidv4();
		cb(null, uuid + ext);
	},
});

const upload = multer({ storage });

export default upload;
