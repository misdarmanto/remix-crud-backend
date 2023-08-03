"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const admins_1 = require("../../models/admins");
const config_1 = require("../../config");
const requestChecker_1 = require("../../utilities/requestChecker");
const uuid_1 = require("uuid");
const checkAuth_1 = require("../../utilities/checkAuth");
const createAdmin = async (req, res) => {
    const requestBody = req.body;
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["x-user-id", "adminName", "adminEmail", "adminPassword"],
        requestData: { ...requestBody, ...req.headers },
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const checkCurrentAdmin = await (0, checkAuth_1.isSuperAdmin)({
            adminId: req.header("x-user-id"),
        });
        if (!checkCurrentAdmin) {
            const message = `access denied!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(response);
        }
        const checkIsUserAlreadyExis = await admins_1.AdminModel.findOne({
            raw: true,
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                adminEmail: { [sequelize_1.Op.eq]: requestBody.adminEmail },
            },
        });
        if (checkIsUserAlreadyExis?.adminEmail) {
            const message = `Email sudah terdatar. Silahkan gunakan email lain.`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(response);
        }
        const hashPassword = require("crypto")
            .createHash("sha1")
            .update(requestBody.adminPassword + config_1.CONFIG.secret.password_encryption)
            .digest("hex");
        requestBody.adminId = (0, uuid_1.v4)();
        requestBody.adminPassword = hashPassword;
        requestBody.adminCreatedBy = checkCurrentAdmin.adminName;
        await admins_1.AdminModel.create(requestBody);
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
exports.createAdmin = createAdmin;
