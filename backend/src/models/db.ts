import {Sequelize} from "sequelize"
import config from "config";

export default new Sequelize(
	config.get("database.NAME"),
	config.get("database.USER"),
	config.get("database.PASSWORD"),
	{
		dialect: 'postgres',
		host: config.get("database.HOST"),
		port: config.get("database.PORT"),
		logging: config.get("database.LOGGING")
	}
)
