import { Sequelize } from "sequelize";
import { DATABASES } from "../config/databases";
export const sequelize = new Sequelize(
	`mysql://${DATABASES.users.db_username}:${DATABASES.users.db_password}@${DATABASES.users.db_host}:${DATABASES.users.db_port}/${DATABASES.users.db_name}`,
	{
		logging: DATABASES.users.db_log,
	}
);
