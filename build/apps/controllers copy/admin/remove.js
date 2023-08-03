"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAdmin = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const admins_1 = require("../../models/admins");
const requestChecker_1 = require("../../utilities/requestChecker");
const removeAdmin = async (req, res) => {
    const requestQuery = req.query;
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["adminId"],
        requestData: req.query,
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const result = await admins_1.AdminModel.update({ deleted: 1 }, {
            where: { adminId: { [sequelize_1.Op.eq]: requestQuery.adminId } },
        });
        return res.status(http_status_codes_1.StatusCodes.OK).json(result);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.removeAdmin = removeAdmin;
