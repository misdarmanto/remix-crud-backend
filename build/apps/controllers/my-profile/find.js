"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMyProfile = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const admins_1 = require("../../models/admins");
const requestChecker_1 = require("../../utilities/requestChecker");
const findMyProfile = async (req, res) => {
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["x-user-id"],
        requestData: req.headers,
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const admin = await admins_1.AdminModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                adminId: { [sequelize_1.Op.eq]: req.header("x-user-id") },
            },
            attributes: [
                "adminId",
                "adminName",
                "adminEmail",
                "adminRole",
                "createdOn",
                "modifiedOn",
            ],
        });
        if (!admin) {
            const message = `user not found!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        const response = response_1.ResponseData.default;
        response.data = admin;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.findMyProfile = findMyProfile;
