"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKabupatenStatistic = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const users_1 = require("../../models/users");
const getKabupatenStatistic = async (req, res) => {
    try {
        const totalKabupatenPemalang = await getTotalKabupaten("PEMALANG");
        const totalKotaPekalongan = await getTotalKabupaten("KOTA PEKALONGAN");
        const totalKabupatenPekalongan = await getTotalKabupaten("KABUPATEN PEKALONGAN");
        const totalKabupatenBatang = await getTotalKabupaten("KABUPATEN BATANG");
        const response = response_1.ResponseData.default;
        response.data = {
            totalKotaPekalongan,
            totalKabupatenPemalang,
            totalKabupatenPekalongan,
            totalKabupatenBatang,
        };
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.getKabupatenStatistic = getKabupatenStatistic;
const getTotalKabupaten = async (name) => {
    const result = await users_1.UsersModel.count({
        where: {
            deleted: { [sequelize_1.Op.eq]: 0 },
            userKabupaten: { [sequelize_1.Op.eq]: name },
        },
    });
    return result;
};
