"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waBlasSendMessage = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const waBlasSettings_1 = require("../../models/waBlasSettings");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
const users_1 = require("../../models/users");
const waBlasSendMessage = async (req, res) => {
    try {
        const waBlasSettings = await waBlasSettings_1.WaBlasSettingsModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        if (!waBlasSettings) {
            const message = `wa blas settings not found!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        const users = await users_1.UsersModel.findAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        for (let user of users) {
            await handleSendWhatsAppMessage({
                whatsAppNumber: user.userPhoneNumber,
                message: waBlasSettings.waBlasSettingsMessage,
            });
        }
        const response = response_1.ResponseData.default;
        response.data = { message: "succsess" };
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.waBlasSendMessage = waBlasSendMessage;
const handleSendWhatsAppMessage = async ({ message, whatsAppNumber, }) => {
    const baseUrlPath = "https://solo.wablas.com/api/send-message?phone=";
    const apiUrl = `${baseUrlPath}${whatsAppNumber}&message=${message}&token=${config_1.CONFIG.waBlasToken}`;
    try {
        await axios_1.default.get(apiUrl);
    }
    catch (error) {
        console.log("Error:", error.message);
    }
};
