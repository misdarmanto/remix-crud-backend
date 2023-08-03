"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressByQuery = exports.getAddress = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const requestChecker_1 = require("../../utilities/requestChecker");
const address_1 = require("../../models/mysql/users/address");
const sequelize_1 = require("sequelize");
const getAddress = async (req, res) => {
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["x-user-id"],
        requestData: req.headers,
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const address = await address_1.AddressModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                user_id: { [sequelize_1.Op.eq]: req.header("x-user-id") },
            },
        });
        const response = response_1.ResponseData.default;
        response.data = address;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        const message = `Tidak dapat memproses permintaan. Laporkan kendala ini! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.getAddress = getAddress;
const getAddressByQuery = async (req, res) => {
    try {
        const address = await address_1.AddressModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                ...(req.query.user_id && {
                    user_id: { [sequelize_1.Op.eq]: req.query.user_id },
                }),
                ...(req.query.id && {
                    id: { [sequelize_1.Op.eq]: req.query.id },
                }),
            },
        });
        const response = response_1.ResponseData.default;
        response.data = address;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        const message = `Tidak dapat memproses permintaan. Laporkan kendala ini! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.getAddressByQuery = getAddressByQuery;
