"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDesaStatistic = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const users_1 = require("../../models/users");
const requestChecker_1 = require("../../utilities/requestChecker");
const getDesaStatistic = async (req, res) => {
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["kabupatenId", "kecamatanId"],
        requestData: req.query,
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const listOfDesaRegistered = await getDesaRegistered({
            kabupatenId: req.query.kabupatenId,
            kecamatanId: req.query.kecamatanId,
        });
        const response = response_1.ResponseData.default;
        response.data = listOfDesaRegistered;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.getDesaStatistic = getDesaStatistic;
const getDesaRegistered = async ({ kecamatanId, kabupatenId }) => {
    const result = [];
    const findUsers = await users_1.UsersModel.findAll({
        where: {
            deleted: { [sequelize_1.Op.eq]: 0 },
            userKecamatanId: { [sequelize_1.Op.eq]: kecamatanId },
            userKabupatenId: { [sequelize_1.Op.eq]: kabupatenId },
        },
    });
    const uniqueDesaId = [...new Set(findUsers.map((item) => item.userDesaId))];
    for (let i = 0; uniqueDesaId.length > i; i++) {
        const totalDesa = await users_1.UsersModel.count({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                userDesaId: { [sequelize_1.Op.eq]: uniqueDesaId[i] },
                userKecamatanId: { [sequelize_1.Op.eq]: kecamatanId },
                userKabupatenId: { [sequelize_1.Op.eq]: kabupatenId },
            },
        });
        const findUserWithDesaId = findUsers.find((item) => item.userDesaId === uniqueDesaId[i]);
        result.push({
            desa: findUserWithDesaId?.userDesa,
            desaId: findUserWithDesaId?.userDesaId,
            kecamatanId: findUserWithDesaId?.userKabupatenId,
            kabupatenId: findUserWithDesaId?.userKabupatenId,
            totalUser: totalDesa,
        });
    }
    return result;
};
