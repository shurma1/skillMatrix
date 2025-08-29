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
import SkillRepository from "./repositories/skill.repository";
import * as http from "node:http";
import {getLocalIp} from "./utils/getLocalIp";
initEnv();

export const ROOT_PATH = path.resolve(__dirname, '..');

export const isDev = process.env.mode === "development";

const PORT = Number(process.env.PORT || config.get("server.PORT") || 8000);

const localIp = getLocalIp();
export const HOST = isDev ? 'localhost' : localIp;

const app = express();
export const server = http.createServer(app);

app.use(cookieParser());

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || `http://${HOST}:${PORT}`;
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
				showExtensions: true,
				showCommonExtensions: true,
			},
		})
	);
}

app.use(express.json());
app.use('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', router);

app.use(express.static(path.join(__dirname, './view')));
app.get('/*splat', (req, res) => {
	res.sendFile(path.join(__dirname, './view', 'index.html'));
});

app.use(errorHandlingMiddleware);

if(! HOST) {
	Logger.error('INVALID HOST IP')
	throw new Error();
}

const start  = async () => {
	
	await Sequelize.authenticate();
	await Sequelize.sync();
	
	await SkillRepository.isAuthorOrVerifier('c3ecec0c-1438-44f4-a969-d745a6642f63', '3d5dd56b-0732-48fe-afac-2a99a15bd704')
	
	const ADDRESS = isDev ? 'http://localhost:${PORT}/api' : `http://${HOST}:${PORT}`;
	
	server.listen(
		PORT,
		() => {
			Logger.log(`Server started on ${ADDRESS}/api [${isDev ? 'Development': 'Production'}]`);
			if(isDev) {
				Logger.log(`Swagger http://localhost:${PORT}/api/docs/`);
			}
		}
	)
	
	const dailyTask = new DailyTaskService();
 
	// Bind or wrap methods to preserve `this` context in production builds
	dailyTask.register(() => { void SkillService.checkExpirationDateOfTheSkills(); });
	dailyTask.register(() => { void SkillService.checkExpirationDateOfTheUserSkills(); });
	
	dailyTask.start();
}


start();
