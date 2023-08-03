"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findKecamatan = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const kecamatan_1 = require("../../models/kecamatan");
const findKecamatan = async (req, res) => {
    try {
        const kecamatan = await kecamatan_1.KecamatanModel.findAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
            attributes: ["kecamatanId", "kecamatanName", "kabupatenId", "provinceId"],
        });
        if (!kecamatan) {
            const message = `data tidak ditemukan!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        const response = response_1.ResponseData.default;
        response.data = kecamatan;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.findKecamatan = findKecamatan;
