import express from 'express';
import config from "config";
import { Sequelize } from './models';
import router from "./routes";
import path from "path";
import {initEnv} from "./utils/InitEnv";
import {Logger} from "./utils/logger";

initEnv();

export const ROOT_PATH = path.resolve(__dirname, '..');
export const UPLOAD_PATH = path.resolve(ROOT_PATH, 'upload');

const PORT = config.get("server.PORT") || 8000;
const HOST = config.get("server.HOST") || 'localhost';

const app = express();

app.use('/api', router)


const start  = async () => {
	
	await Sequelize.authenticate();
	await Sequelize.sync();
	
	app.listen(
		PORT,
		() => {
			Logger.log(`start http://localhost:${PORT}`);
		}
	)
}


start();
