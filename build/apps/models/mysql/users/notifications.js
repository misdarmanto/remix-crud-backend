"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const _1 = require(".");
const zygote_1 = require("../zygote");
exports.NotificationModel = _1.sequelize.define("notifications", {
    ...zygote_1.ZygoteModel,
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    title: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    message: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: true
    },
    data: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true
    },
    read: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
}, {
    ..._1.sequelize, timestamps: false, tableName: 'notifications', deletedAt: false, paranoid: true, underscored: true, freezeTableName: true,
    engine: 'InnoDB',
    hooks: {
        beforeCreate: (record, options) => {
            let now = (0, moment_1.default)().add(7, "hours").format('YYYY-MM-DD HH:mm:ss');
            record.created_on = now;
            record.modified_on = null;
        },
        beforeUpdate: (record, options) => {
            let now = (0, moment_1.default)().add(7, "hours").format('YYYY-MM-DD HH:mm:ss');
            record.modified_on = now;
        },
    }
});
