"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelawanModel = void 0;
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const _1 = require(".");
const zygote_1 = require("./zygote");
exports.RelawanModel = _1.sequelize.define("relawan", {
    ...zygote_1.ZygoteModel,
    relawanId: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    relawanName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    ..._1.sequelize,
    timestamps: false,
    tableName: "relawan",
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
