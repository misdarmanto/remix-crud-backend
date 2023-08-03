"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findKabupaten = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const kabupaten_1 = require("../../models/kabupaten");
const findKabupaten = async (req, res) => {
    try {
        const kabupaten = await kabupaten_1.KabupatenModel.findAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
            attributes: ["kabupatenId", "kabupatenName", "provinceId"],
        });
        if (!kabupaten) {
            const message = `data tidak ditemukan!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        const response = response_1.ResponseData.default;
        response.data = kabupaten;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.findKabupaten = findKabupaten;
