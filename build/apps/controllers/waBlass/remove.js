"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRelawanTim = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const requestChecker_1 = require("../../utilities/requestChecker");
const relawanTim_1 = require("../../models/relawanTim");
const removeRelawanTim = async (req, res) => {
    const requestQuery = req.query;
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["relawanTimId"],
        requestData: requestQuery,
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const user = await relawanTim_1.RelawanTimModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                relawanTimId: { [sequelize_1.Op.eq]: requestQuery.relawanTimId },
            },
        });
        if (!user) {
            const message = `data tidak ditemukan!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        await relawanTim_1.RelawanTimModel.update({ deleted: 1 }, {
            where: {
                relawanTimId: { [sequelize_1.Op.eq]: requestQuery.relawanTimId },
            },
        });
        const response = response_1.ResponseData.default;
        response.data = { message: "success" };
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.removeRelawanTim = removeRelawanTim;
