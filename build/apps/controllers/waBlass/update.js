"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRelawanTim = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const requestChecker_1 = require("../../utilities/requestChecker");
const relawanTim_1 = require("../../models/relawanTim");
const updateRelawanTim = async (req, res) => {
    const requestBody = req.body;
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["relawanTimId"],
        requestData: requestBody,
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const newData = {
            ...(requestBody.relawanTimName && {
                relawanTimName: requestBody.relawanTimName,
            }),
        };
        await relawanTim_1.RelawanTimModel.update(newData, {
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                relawanTimId: { [sequelize_1.Op.eq]: requestBody.relawanTimId },
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
exports.updateRelawanTim = updateRelawanTim;
