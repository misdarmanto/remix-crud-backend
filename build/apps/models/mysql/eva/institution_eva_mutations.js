"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionEvaMutationModel = void 0;
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const _1 = require(".");
const zygote_1 = require("../zygote");
exports.InstitutionEvaMutationModel = _1.sequelize.define("institution_eva_mutations", {
    ...zygote_1.ZygoteModel,
    trx_code: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    trx_serialization: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    institution_eva_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    institution_eva_code: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    remarks: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    starting_balance: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00
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
    ending_balance: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.00
    },
}, {
    ..._1.sequelize, timestamps: false, tableName: 'institution_eva_mutations', deletedAt: false, paranoid: true, underscored: true, freezeTableName: true,
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
