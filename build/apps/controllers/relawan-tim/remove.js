"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const requestChecker_1 = require("../../utilities/requestChecker");
const users_1 = require("../../models/users");
const removeUser = async (req, res) => {
    const requestQuery = req.query;
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["userId"],
        requestData: requestQuery,
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const user = await users_1.UsersModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                userId: { [sequelize_1.Op.eq]: requestQuery.userId },
            },
        });
        if (!user) {
            const message = `data tidak ditemukan!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        await users_1.UsersModel.update({ deleted: 1 }, {
            where: {
                userId: { [sequelize_1.Op.eq]: requestQuery.userId },
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
exports.removeUser = removeUser;
