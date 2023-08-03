"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdmin = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const admins_1 = require("../../models/admins");
const config_1 = require("../../config");
const requestChecker_1 = require("../../utilities/requestChecker");
const updateAdmin = async (req, res) => {
    const requestBody = req.body;
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["adminId", "adminName", "adminEmail", "adminPassword"],
        requestData: requestBody,
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const checkAdmin = await admins_1.AdminModel.findOne({
            raw: true,
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                adminId: { [sequelize_1.Op.eq]: requestBody.adminId },
                adminEmail: { [sequelize_1.Op.eq]: requestBody.adminEmail },
            },
        });
        if (checkAdmin?.adminEmail == requestBody.adminEmail) {
            const message = `Email sudah terdatar. Silahkan gunakan email lain.`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(response);
        }
        if (requestBody.adminPassword) {
            requestBody.adminPassword = require("crypto")
                .createHash("sha1")
                .update(requestBody.adminPassword + config_1.CONFIG.secret.password_encryption)
                .digest("hex");
        }
        const newData = {
            ...(requestBody.adminName && {
                name: requestBody.adminName,
            }),
            ...(requestBody.adminEmail && {
                email: requestBody.adminEmail,
            }),
            ...(requestBody.adminPassword && {
                password: requestBody.adminPassword,
            }),
        };
        await admins_1.AdminModel.update(newData, {
            where: { adminId: { [sequelize_1.Op.eq]: requestBody.adminId } },
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
exports.updateAdmin = updateAdmin;
