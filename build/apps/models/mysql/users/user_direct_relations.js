"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDirectRelationModel = void 0;
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const _1 = require(".");
const zygote_1 = require("../zygote");
exports.UserDirectRelationModel = _1.sequelize.define("user_direct_relations", {
    ...zygote_1.ZygoteModel,
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    user_name: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    partner_user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    partner_user_name: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
}, {
    ..._1.sequelize, timestamps: false, tableName: 'user_direct_relations', deletedAt: false, paranoid: true, underscored: true, freezeTableName: true,
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
