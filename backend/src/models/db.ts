import {Sequelize} from "sequelize"
import config from "config";

const dbPortRaw = config.get("database.PORT") as unknown as string | number;
const dbLoggingRaw = config.get("database.LOGGING") as unknown as string | boolean;

const dbPort = typeof dbPortRaw === 'string' ? Number(dbPortRaw) : dbPortRaw;
const dbLogging = typeof dbLoggingRaw === 'string' ? ['1', 'true', 'yes', 'on'].includes(dbLoggingRaw.toLowerCase()) : !!dbLoggingRaw;

export default new Sequelize(
	config.get("database.NAME"),
	config.get("database.USER"),
	config.get("database.PASSWORD"),
	{
		dialect: 'postgres',
		host: config.get("database.HOST"),
		port: dbPort,
		logging: dbLogging
	}
)
