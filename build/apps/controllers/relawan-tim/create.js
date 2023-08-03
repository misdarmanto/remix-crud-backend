"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRelawanTim = void 0;
const http_status_codes_1 = require("http-status-codes");
const uuid_1 = require("uuid");
const requestChecker_1 = require("../../utilities/requestChecker");
const response_1 = require("../../utilities/response");
const relawanTim_1 = require("../../models/relawanTim");
const createRelawanTim = async (req, res) => {
    const requestBody = req.body;
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["relawanTimName"],
        requestData: requestBody,
    });
    if (emptyField) {
        const message = `mohon lengkapi data berikut(${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        requestBody.relawanTimId = (0, uuid_1.v4)();
        await relawanTim_1.RelawanTimModel.create(requestBody);
        const response = response_1.ResponseData.default;
        response.data = { message: "success" };
        return res.status(http_status_codes_1.StatusCodes.CREATED).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.createRelawanTim = createRelawanTim;
