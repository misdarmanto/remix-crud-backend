"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKecamatanStatistic = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const users_1 = require("../../models/users");
const requestChecker_1 = require("../../utilities/requestChecker");
const getKecamatanStatistic = async (req, res) => {
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["kabupatenId"],
        requestData: req.query,
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const listOfKecamatanRegistered = await getKecamatanRegistered(req.query.kabupatenId);
        const response = response_1.ResponseData.default;
        response.data = listOfKecamatanRegistered;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.getKecamatanStatistic = getKecamatanStatistic;
const getKecamatanRegistered = async (kabupatenId) => {
    const result = [];
    const findAllUsersWithKabupatenId = await users_1.UsersModel.findAll({
        where: {
            deleted: { [sequelize_1.Op.eq]: 0 },
            userKabupatenId: { [sequelize_1.Op.eq]: kabupatenId },
        },
    });
    const uniqueKecamatanId = [
        ...new Set(findAllUsersWithKabupatenId.map((item) => item.userKecamatanId)),
    ];
    for (let i = 0; uniqueKecamatanId.length > i; i++) {
        const totalDesa = await users_1.UsersModel.count({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                userKecamatanId: { [sequelize_1.Op.eq]: uniqueKecamatanId[i] },
            },
        });
        const findData = findAllUsersWithKabupatenId.find((item) => item.userKecamatanId === uniqueKecamatanId[i]);
        result.push({
            kecamatan: findData?.userKecamatan,
            kecamatanId: findData?.userKecamatanId,
            kabupatenId: findData?.userKabupatenId,
            totalUser: totalDesa,
        });
    }
    return result;
};
