"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBanksModel = void 0;
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const _1 = require(".");
const zygote_1 = require("../zygote");
exports.UserBanksModel = _1.sequelize.define("user_banks", {
    ...zygote_1.ZygoteModel,
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    bank_code: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    bank_name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    bank_icon: {
        type: sequelize_1.DataTypes.TINYINT,
        allowNull: false
    },
    account_holder: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    account_number: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
}, {
    ..._1.sequelize, timestamps: false, tableName: 'user_banks', deletedAt: false, paranoid: true, underscored: true, freezeTableName: true,
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
