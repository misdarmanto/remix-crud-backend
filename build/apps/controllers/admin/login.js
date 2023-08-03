"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const admins_1 = require("../../models/admins");
const config_1 = require("../../config");
const sessions_1 = require("../../models/sessions");
const uuid_1 = require("uuid");
const requestChecker_1 = require("../../utilities/requestChecker");
const loginAdmin = async (req, res) => {
    const requestBody = req.body;
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["adminEmail", "adminPassword"],
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
                adminEmail: { [sequelize_1.Op.eq]: requestBody.adminEmail },
            },
        });
        if (!checkAdmin) {
            const message = `User belum terdaftar.`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(response);
        }
        const hashPassword = require("crypto")
            .createHash("sha1")
            .update(requestBody.adminPassword + config_1.CONFIG.secret.password_encryption)
            .digest("hex");
        console.log("hash");
        console.log(hashPassword);
        if (hashPassword !== checkAdmin.adminPassword) {
            const message = `Kombinasi email dan password tidak dikenal`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(response);
        }
        let expired = new Date();
        expired.setHours(expired.getDate() + 10);
        const checkSession = await sessions_1.SessionModel.findOne({
            raw: true,
            where: {
                sessionId: { [sequelize_1.Op.eq]: checkAdmin?.adminId },
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        const sessionData = {
            sessionId: (0, uuid_1.v4)(),
            sessionAdminId: checkAdmin?.adminId,
            session: (0, uuid_1.v4)(),
            sessionExpiredOn: expired.getTime(),
            deleted: 0,
        };
        if (!checkSession) {
            await sessions_1.SessionModel.create(sessionData);
        }
        else {
            await sessions_1.SessionModel.update(sessionData, {
                where: {
                    sessionId: { [sequelize_1.Op.eq]: checkAdmin?.adminId },
                    deleted: { [sequelize_1.Op.eq]: 0 },
                },
            });
        }
        const responseData = {
            adminId: checkAdmin?.adminId,
            adminName: checkAdmin?.adminName,
            adminEmail: checkAdmin?.adminEmail,
            adminRole: checkAdmin.adminRole,
            session: sessionData.session,
            sessionExpiredOn: sessionData.sessionExpiredOn,
        };
        const response = response_1.ResponseData.default;
        response.data = responseData;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.loginAdmin = loginAdmin;
