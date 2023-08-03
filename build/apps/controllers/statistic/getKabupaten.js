"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKabupatenStatistic = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const users_1 = require("../../models/users");
const kabupaten_1 = require("../../models/kabupaten");
const getKabupatenStatistic = async (req, res) => {
    try {
        const totalKabupaten = await getTotalKabupaten();
        const response = response_1.ResponseData.default;
        response.data = totalKabupaten;
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
const getTotalKabupaten = async () => {
    const result = [];
    const kabupaten = await kabupaten_1.KabupatenModel.findAll({
        where: {
            deleted: { [sequelize_1.Op.eq]: 0 },
            provinceId: { [sequelize_1.Op.eq]: 1 },
        },
    });
    for (let i = 0; kabupaten.length > i; i++) {
        const totalUsers = await users_1.UsersModel.count({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                userKabupatenId: { [sequelize_1.Op.eq]: kabupaten[i].kabupatenId },
            },
        });
        result.push({
            kabupatenName: kabupaten[i].kabupatenName,
            kabupatenId: kabupaten[i].kabupatenId,
            totalUser: totalUsers,
        });
    }
    return result;
};
