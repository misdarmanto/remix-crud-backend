"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaBlasHistoryModel = void 0;
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const _1 = require(".");
const zygote_1 = require("./zygote");
exports.WaBlasHistoryModel = _1.sequelize.define("wa_blas_history", {
    ...zygote_1.ZygoteModel,
    waBlasHistoryId: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    waBlasHistoryUserId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    waBlasHistoryUserName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    waBlasHistoryUserPhone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    waBlasHistoryMessage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    ..._1.sequelize,
    timestamps: false,
    tableName: "wa_blas_history",
    deletedAt: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    engine: "InnoDB",
    hooks: {
        beforeCreate: (record, options) => {
            let now = (0, moment_1.default)().add(7, "hours").format("YYYY-MM-DD HH:mm:ss");
            record.createdOn = now;
            record.modifiedOn = null;
        },
        beforeUpdate: (record, options) => {
            let now = (0, moment_1.default)().add(7, "hours").format("YYYY-MM-DD HH:mm:ss");
            record.modifiedOn = now;
        },
    },
});
