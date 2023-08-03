"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionEvaModel = void 0;
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const _1 = require(".");
const zygote_1 = require("../zygote");
exports.InstitutionEvaModel = _1.sequelize.define("institution_eva", {
    ...zygote_1.ZygoteModel,
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    code: {
        type: sequelize_1.DataTypes.STRING(100),
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
    ..._1.sequelize, timestamps: false, tableName: 'institution_eva', deletedAt: false, paranoid: true, underscored: true, freezeTableName: true,
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
