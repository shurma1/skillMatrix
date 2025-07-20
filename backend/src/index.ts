import express from 'express';
import config from "config";
import { Sequelize } from './models';

const app = express();

app.get('/', (req, res, next) => res.send('TEST'))

const PORT = config.get("server.PORT") || 8000;

const start  = async () => {
	
	await Sequelize.authenticate();
	await Sequelize.sync();
	
	app.listen(
		PORT,
		() => {
			console.log(`start http://localhost:${PORT}`);
		}
	)
}


start();
