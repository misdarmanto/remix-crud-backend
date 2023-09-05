"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllRelawanMember = exports.findOneRelawanTim = exports.allRelawanTim = exports.findAllRelawanTim = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const pagination_1 = require("../../utilities/pagination");
const relawanTim_1 = require("../../models/relawanTim");
const findAllRelawanTim = async (req, res) => {
    try {
        const page = new pagination_1.Pagination(+req.query.page || 0, +req.query.size || 10);
        const result = await relawanTim_1.RelawanTimModel.findAndCountAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                ...(req.query.search && {
                    [sequelize_1.Op.or]: [
                        { userName: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
                        { userPhoneNumber: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
                    ],
                }),
            },
            order: [["id", "desc"]],
            ...(req.query.pagination == "true" && {
                limit: page.limit,
                offset: page.offset,
            }),
        });
        const response = response_1.ResponseData.default;
        response.data = page.data(result);
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.findAllRelawanTim = findAllRelawanTim;
const allRelawanTim = async (req, res) => {
    try {
        const relawanTim = await relawanTim_1.RelawanTimModel.findAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        if (!relawanTim) {
            const message = `relawan tim not found!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        const response = response_1.ResponseData.default;
        response.data = relawanTim;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.allRelawanTim = allRelawanTim;
const findOneRelawanTim = async (req, res) => {
    try {
        const relawanTim = await relawanTim_1.RelawanTimModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                relawanTimId: { [sequelize_1.Op.eq]: req.params.id },
            },
        });
        if (!relawanTim) {
            const message = `relawan tim not found!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        const response = response_1.ResponseData.default;
        response.data = relawanTim;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.findOneRelawanTim = findOneRelawanTim;
const findAllRelawanMember = async (req, res) => {
    try {
        const page = new pagination_1.Pagination(+req.query.page || 0, +req.query.size || 10);
        const result = await relawanTim_1.RelawanTimModel.findAndCountAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                relawanTimName: { [sequelize_1.Op.eq]: req.params.relawanTimName },
            },
            order: [["id", "desc"]],
            ...(req.query.pagination == "true" && {
                limit: page.limit,
                offset: page.offset,
            }),
        });
        const response = response_1.ResponseData.default;
        response.data = page.data(result);
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.findAllRelawanMember = findAllRelawanMember;
