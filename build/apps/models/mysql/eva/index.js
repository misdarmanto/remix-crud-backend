"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const databases_1 = require("../../../config/databases");
exports.sequelize = new sequelize_1.Sequelize(`mysql://${databases_1.DATABASES.eva.db_username}:${databases_1.DATABASES.eva.db_password}@${databases_1.DATABASES.eva.db_host}:${databases_1.DATABASES.eva.db_port}/${databases_1.DATABASES.eva.db_name}`, {
    logging: databases_1.DATABASES.eva.db_log
});
