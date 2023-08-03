"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserKycModel = void 0;
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const _1 = require(".");
const zygote_1 = require("../zygote");
exports.UserKycModel = _1.sequelize.define("user_kyc", {
    ...zygote_1.ZygoteModel,
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    user_name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    identity_number: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    identity_image: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    identity_selfie_image: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('waiting', 'approved', 'rejected'),
        allowNull: false
    },
    approved_by: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
}, {
    ..._1.sequelize, timestamps: false, tableName: 'user_kyc', deletedAt: false, paranoid: true, underscored: true, freezeTableName: true,
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
