"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSessionModel = void 0;
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const _1 = require(".");
const zygote_1 = require("../zygote");
exports.UserSessionModel = _1.sequelize.define("user_sessions", {
    ...zygote_1.ZygoteModel,
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    user_phone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: 'users',
            key: 'phone'
        }
    },
    device_id: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    device_type: {
        type: sequelize_1.DataTypes.ENUM('android', 'ios', 'web'),
        allowNull: false,
        defaultValue: "android"
    },
    device_brand: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true
    },
    device_model: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true
    },
    fcm_id: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    session: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    geolocation: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true
    },
    expired_on: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true
    },
}, {
    ..._1.sequelize, timestamps: false, tableName: 'user_sessions', deletedAt: false, paranoid: true, underscored: true, freezeTableName: true,
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
