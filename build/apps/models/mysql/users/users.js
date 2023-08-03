"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const _1 = require(".");
const zygote_1 = require("../zygote");
const notifications_1 = require("./notifications");
const user_direct_relations_1 = require("./user_direct_relations");
const user_sessions_1 = require("./user_sessions");
exports.UserModel = _1.sequelize.define("users", {
    ...zygote_1.ZygoteModel,
    name: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    phone_verified: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: true,
    },
    email_verified: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    photo: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM("member", "mentor", "seller"),
        allowNull: false,
        defaultValue: "member",
    },
    account_status: {
        type: sequelize_1.DataTypes.ENUM("active", "inactive", "blocked"),
        allowNull: false,
        defaultValue: "active",
    },
    account_kyc: {
        type: sequelize_1.DataTypes.ENUM("inexist", "waiting", "approved", "rejected"),
        allowNull: false,
        defaultValue: "inexist",
    },
    account_type: {
        type: sequelize_1.DataTypes.ENUM("default", "corporate"),
        allowNull: false,
        defaultValue: "default",
    },
    subscription_status: {
        type: sequelize_1.DataTypes.ENUM("unsubscribe", "subscribe"),
        allowNull: false,
        defaultValue: "unsubscribe",
    },
    subscription_until_date: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    unsubscribe_days: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    referral_code: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    reference_user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    reference_user_name: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: true,
    },
    total_direct_users: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    ..._1.sequelize,
    timestamps: false,
    tableName: "users",
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
exports.UserModel.hasMany(notifications_1.NotificationModel, { sourceKey: "id", foreignKey: "user_id" });
exports.UserModel.hasMany(user_direct_relations_1.UserDirectRelationModel, { sourceKey: "id", foreignKey: "partner_user_id" });
exports.UserModel.hasOne(user_sessions_1.UserSessionModel, { sourceKey: "id", foreignKey: "user_id" });
