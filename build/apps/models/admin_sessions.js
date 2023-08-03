"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSessionModel = void 0;
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const _1 = require(".");
const zygote_1 = require("./zygote");
exports.AdminSessionModel = _1.sequelize.define("admin_sessions", {
    ...zygote_1.ZygoteModel,
    admin_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    metadata: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
    fcm_id: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    session: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    expired_on: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: true,
    },
}, {
    ..._1.sequelize,
    timestamps: false,
    tableName: "admin_sessions",
    deletedAt: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    engine: "InnoDB",
    hooks: {
        beforeCreate: (record, options) => {
            let now = (0, moment_1.default)().add(7, "hours").format("YYYY-MM-DD HH:mm:ss");
            record.created_on = now;
            record.modified_on = null;
        },
        beforeUpdate: (record, options) => {
            let now = (0, moment_1.default)().add(7, "hours").format("YYYY-MM-DD HH:mm:ss");
            record.modified_on = now;
        },
    },
});
