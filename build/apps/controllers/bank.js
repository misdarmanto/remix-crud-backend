"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_setting = exports.delete_account_bank = exports.add_account_bank = exports.get_list_bank = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../utilities/response");
const sequelize_1 = require("sequelize");
const pagination_1 = require("../utilities/pagination");
const user_banks_1 = require("../models/mysql/eva/user_banks");
const users_1 = require("../models/mysql/users/users");
const settings_1 = require("../models/mysql/eva/settings");
const get_list_bank = async (req, res) => {
    try {
        const page = new pagination_1.Pagination(+req.query.page || 0, +req.query.size || 10);
        const banks = await user_banks_1.UserBanksModel.findAndCountAll({
            where: {
                ...req.header('x-user-id') && {
                    user_id: { [sequelize_1.Op.eq]: req.header('x-user-id') },
                },
                deleted: { [sequelize_1.Op.eq]: 0 }
            },
            order: [['id', 'desc']],
            ...req.query.pagination == "true" && {
                limit: page.limit,
                offset: page.offset
            }
        });
        const response = response_1.ResponseData.default;
        response.data = page.data(banks);
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini.");
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.get_list_bank = get_list_bank;
const add_account_bank = async (req, res) => {
    if (!req.body.bank_code || !req.body.bank_name || !req.body.bank_icon || !req.body.account_holder || !req.body.account_number) {
        const response = response_1.ResponseData.error("Permintaan tidak lengkap.");
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const user = await users_1.UserModel.findOne({
            raw: true,
            where: {
                id: { [sequelize_1.Op.eq]: req.header('x-user-id') },
                deleted: { [sequelize_1.Op.eq]: 0 }
            }
        });
        if (!user) {
            const response = response_1.ResponseData.error("Akun tidak ditemukan.");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
        }
        if (user.name.toLocaleLowerCase() != req.body.account_holder.toLocaleLowerCase()) {
            const response = response_1.ResponseData.error("Nama rekening tujuan dan nama pemilik akun harus sama.");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
        }
        req.body.user_id = req.header('x-user-id');
        const bank = await user_banks_1.UserBanksModel.create(req.body);
        const response = response_1.ResponseData.default;
        response.data = bank;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini.");
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.add_account_bank = add_account_bank;
const delete_account_bank = async (req, res) => {
    if (!req.query.id) {
        const response = response_1.ResponseData.error("Permintaan tidak lengkap.");
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const bank = await user_banks_1.UserBanksModel.update({ deleted: 1 }, {
            where: { id: { [sequelize_1.Op.eq]: req.query.id } }
        });
        const response = response_1.ResponseData.default;
        response.data = bank;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini.");
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.delete_account_bank = delete_account_bank;
const get_setting = async (req, res) => {
    if (!req.query.key) {
        const response = response_1.ResponseData.error("Permintaan tidak lengkap.");
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const withdraw_fee = await settings_1.SettingModel.findOne({
            raw: true,
            where: {
                key: { [sequelize_1.Op.eq]: req.query.key },
                deleted: { [sequelize_1.Op.eq]: 0 }
            }
        });
        const response = response_1.ResponseData.default;
        response.data = withdraw_fee?.value;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini.");
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.get_setting = get_setting;
