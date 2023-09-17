"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModel = void 0;
const moment_1 = __importDefault(require("moment"));
const sequelize_1 = require("sequelize");
const _1 = require(".");
const zygote_1 = require("./zygote");
exports.UsersModel = _1.sequelize.define('users', {
    ...zygote_1.ZygoteModel,
    userId: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    userName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    userDetailAddress: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    userDesa: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    userDesaId: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    userKecamatan: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    userKecamatanId: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    userKabupaten: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    userKabupatenId: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    userPhoneNumber: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    userRelawanTimName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    userRelawanName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    userReferralId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    userReferralPosition: {
        type: sequelize_1.DataTypes.ENUM('korwil', 'korcam', 'kordes', 'kortps', 'pemilih'),
        allowNull: true
    },
    userPosition: {
        type: sequelize_1.DataTypes.ENUM('korwil', 'korcam', 'kordes', 'kortps', 'pemilih'),
        allowNull: false
    }
}, {
    ..._1.sequelize,
    timestamps: false,
    tableName: 'users',
    deletedAt: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    engine: 'InnoDB',
    hooks: {
        beforeCreate: (record, options) => {
            let now = (0, moment_1.default)().add(7, 'hours').format('YYYY-MM-DD HH:mm:ss');
            record.createdOn = now;
            record.modifiedOn = null;
        },
        beforeUpdate: (record, options) => {
            let now = (0, moment_1.default)().add(7, 'hours').format('YYYY-MM-DD HH:mm:ss');
            record.modifiedOn = now;
        }
    }
});
