import express from 'express';
import config from "config";
import {Sequelize} from './models';
import router from "./routes";
import path from "path";
import {initEnv} from "./utils/InitEnv";
import {Logger} from "./utils/logger";
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express'
import {errorHandlingMiddleware} from "./middlewares/errorHandling.middleware";
import Redis from 'ioredis';
import {DailyTaskService} from "./services/dailyTask.service";
import SkillService from "./services/skill.service";

export const redis = new Redis();

initEnv();

export const ROOT_PATH = path.resolve(__dirname, '..');
export const UPLOAD_PATH = path.resolve(ROOT_PATH, 'upload');

export const isDev = process.env.mode === "development";

const PORT = config.get("server.PORT") || 8000;
const HOST = config.get("server.HOST") || 'localhost';

const app = express();


if(isDev) {
	const specs = YAML.load(path.join(ROOT_PATH, 'docs', 'docs.yaml'));
	app.use(
		"/api/docs",
		swaggerUi.serve,
		swaggerUi.setup(specs)
	);
}

app.use(express.json());
app.use('/api', router);
app.use(errorHandlingMiddleware);

const start  = async () => {
	
	await Sequelize.authenticate();
	await Sequelize.sync();
	
	
	app.listen(
		PORT,
		() => {
			Logger.log(`Server started on http://localhost:${PORT}/api/ [${isDev ? 'Development': 'Production'}]`);
			if(isDev) {
				Logger.log(`Swagger http://localhost:${PORT}/api/docs/`);
			}
		}
	)
	
	const dailyTask = new DailyTaskService();
	
	dailyTask.register(SkillService.checkExpirationDateOfTheSkills);
	dailyTask.register(SkillService.checkExpirationDateOfTheUserSkills);
}


start();
