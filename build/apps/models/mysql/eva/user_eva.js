"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEvaModel = void 0;
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const _1 = require(".");
const zygote_1 = require("../zygote");
exports.UserEvaModel = _1.sequelize.define("user_eva", {
    ...zygote_1.ZygoteModel,
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    user_name: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    user_phone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    user_type: {
        type: sequelize_1.DataTypes.ENUM('default', 'corporate'),
        allowNull: false,
        defaultValue: "default"
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('withdraw', 'ad', 'other'),
        allowNull: false,
        defaultValue: "withdraw"
    },
    title: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    credit: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    debit: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    balance: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00
    },
}, {
    ..._1.sequelize, timestamps: false, tableName: 'user_eva', deletedAt: false, paranoid: true, underscored: true, freezeTableName: true,
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
