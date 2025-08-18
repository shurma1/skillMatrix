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
import {DailyTaskService} from "./services/dailyTask.service";
import SkillService from "./services/skill.service";
import cors from 'cors';
import cookieParser from 'cookie-parser';
initEnv();

export const ROOT_PATH = path.resolve(__dirname, '..');
export const UPLOAD_PATH = path.resolve(ROOT_PATH, 'upload');

export const isDev = process.env.mode === "development";

const PORT = Number(process.env.PORT || config.get("server.PORT") || 8000);
const HOST = process.env.HOST || config.get("server.HOST") || '0.0.0.0';

const app = express();

app.use(cookieParser());

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({
	origin: FRONTEND_ORIGIN,
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

if(isDev) {
	const specs = YAML.load(path.join(ROOT_PATH, 'docs', 'docs.yaml'));
	app.use(
		"/api/docs",
		swaggerUi.serve,
		swaggerUi.setup(specs, {
			explorer: true,
			swaggerOptions: {
				// Show vendor extensions like x-permissions in the UI
				showExtensions: true,
				showCommonExtensions: true,
			},
		})
	);
}

app.use(express.json());
app.use('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', router);
app.use(errorHandlingMiddleware);

const start  = async () => {
	
	await Sequelize.authenticate();
	await Sequelize.sync();
	
	app.listen(
		PORT,
		HOST as any,
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
