"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const users_1 = require("../../models/users");
const requestChecker_1 = require("../../utilities/requestChecker");
const updateUser = async (req, res) => {
    const requestBody = req.body;
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["userId"],
        requestData: requestBody,
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const newData = {
            ...(requestBody.userName && {
                userName: requestBody.userName,
            }),
            ...(requestBody.userDetailAddress && {
                userDetailAddress: requestBody.userDetailAddress,
            }),
            ...(requestBody.userDesa && {
                userDesa: requestBody.userDesa,
            }),
            ...(requestBody.userDesaId && {
                userDesaId: requestBody.userDesaId,
            }),
            ...(requestBody.userKecamatan && {
                userKecamatan: requestBody.userKecamatan,
            }),
            ...(requestBody.userKecamatanId && {
                userKecamatanId: requestBody.userKecamatanId,
            }),
            ...(requestBody.userKabupaten && {
                userKabupaten: requestBody.userKabupaten,
            }),
            ...(requestBody.userKabupatenId && {
                userKabupatenId: requestBody.userKabupatenId,
            }),
            ...(requestBody.userPhoneNumber && {
                userPhoneNumber: requestBody.userPhoneNumber,
            }),
            ...(requestBody.userRelawanName && {
                userRelawanName: requestBody.userRelawanName,
            }),
            ...(requestBody.userRelawanTimName && {
                userRelawanTimName: requestBody.userRelawanTimName,
            }),
        };
        await users_1.UsersModel.update(newData, {
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                userId: { [sequelize_1.Op.eq]: requestBody.userId },
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
exports.updateUser = updateUser;
