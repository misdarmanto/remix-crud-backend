"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.institution_balance = exports.statistic_users = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../utilities/response");
const sequelize_1 = require("sequelize");
const users_1 = require("../models/mysql/users/users");
const institution_eva_1 = require("../models/mysql/eva/institution_eva");
const user_eva_1 = require("../models/mysql/eva/user_eva");
const statistic_users = async (req, res) => {
    try {
        const result = {
            total_user: await users_1.UserModel.count({ where: { deleted: { [sequelize_1.Op.eq]: 0 } } }),
            total_user_subscription: await users_1.UserModel.count({ where: { deleted: { [sequelize_1.Op.eq]: 0 }, subscription_status: { [sequelize_1.Op.eq]: "subscribe" } } }),
            balance: {
                withdraw: await user_eva_1.UserEvaModel.sum('balance', { where: { deleted: { [sequelize_1.Op.eq]: 0 }, type: { [sequelize_1.Op.eq]: 'withdraw' }, user_type: { [sequelize_1.Op.eq]: 'default' } } }),
                ad: await user_eva_1.UserEvaModel.sum('balance', { where: { deleted: { [sequelize_1.Op.eq]: 0 }, type: { [sequelize_1.Op.eq]: 'ad' }, user_type: { [sequelize_1.Op.eq]: 'default' } } }),
                other: await user_eva_1.UserEvaModel.sum('balance', { where: { deleted: { [sequelize_1.Op.eq]: 0 }, type: { [sequelize_1.Op.eq]: 'other' }, user_type: { [sequelize_1.Op.eq]: 'default' } } }),
                hold: await user_eva_1.UserEvaModel.sum('balance', { where: { deleted: { [sequelize_1.Op.eq]: 0 }, type: { [sequelize_1.Op.eq]: 'hold' }, user_type: { [sequelize_1.Op.eq]: 'default' } } })
            }
        };
        const response = response_1.ResponseData.default;
        response.data = result;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini.");
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.statistic_users = statistic_users;
const institution_balance = async (req, res) => {
    try {
        const response = response_1.ResponseData.default;
        response.data = await institution_eva_1.InstitutionEvaModel.findAll({
            raw: true, where: { deleted: { [sequelize_1.Op.eq]: 0 } }
        });
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini.");
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.institution_balance = institution_balance;
