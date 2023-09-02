"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findWaBlasSettings = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const waBlasSettings_1 = require("../../models/waBlasSettings");
const findWaBlasSettings = async (req, res) => {
    try {
        const waBlasSettings = await waBlasSettings_1.WaBlasSettingsModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        // if (!waBlasSettings) {
        // 	const message = `wa blas settings not found!`;
        // 	const response = <ResponseDataAttributes>ResponseData.error(message);
        // 	return res.status(StatusCodes.NOT_FOUND).json(response);
        // }
        const response = response_1.ResponseData.default;
        response.data = waBlasSettings;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.findWaBlasSettings = findWaBlasSettings;
