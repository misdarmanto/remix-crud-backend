"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const requestChecker_1 = require("../../utilities/requestChecker");
const address_1 = require("../../models/mysql/users/address");
const sequelize_1 = require("sequelize");
const deleteAddress = async (req, res) => {
    const body = req.body;
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["id", "x-user-id"],
        requestData: { ...req.query, ...req.headers },
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const checkAddress = await address_1.AddressModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                id: { [sequelize_1.Op.eq]: req.query.id },
                user_id: { [sequelize_1.Op.eq]: req.header("x-user-id") },
            },
        });
        if (!checkAddress) {
            const message = `Address tidak ditemukan`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        await address_1.AddressModel.update({ deleted: 1 }, {
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                id: { [sequelize_1.Op.eq]: req.query.id },
                user_id: { [sequelize_1.Op.eq]: req.header("x-user-id") },
            },
        });
        const response = response_1.ResponseData.default;
        response.data = body;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `Tidak dapat memproses permintaan. Laporkan kendala ini! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.deleteAddress = deleteAddress;
