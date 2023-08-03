"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSellerProfile = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const users_1 = require("../../models/mysql/users/users");
const requestChecker_1 = require("../../utilities/requestChecker");
const getSellerProfile = async (req, res) => {
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["user_id"],
        requestData: req.query,
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const result = await users_1.UserModel.findOne({
            where: {
                id: { [sequelize_1.Op.eq]: req.query.user_id },
                role: { [sequelize_1.Op.eq]: "seller" },
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        if (!result) {
            const message = `user not found!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        const response = response_1.ResponseData.default;
        response.data = result;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.getSellerProfile = getSellerProfile;
