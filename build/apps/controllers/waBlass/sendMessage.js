"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waBlasSendMessage = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const config_1 = require("../../config");
const users_1 = require("../../models/users");
const waBlasHistory_1 = require("../../models/waBlasHistory");
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const waBlasSendMessage = async (req, res) => {
    try {
        const users = await users_1.UsersModel.findAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        for (let user of users) {
            await handleSendWhatsAppMessage({
                whatsAppNumber: user.userPhoneNumber,
                message: req.body.whatsAppMessage,
            });
            const payload = {
                waBlasHistoryId: (0, uuid_1.v4)(),
                waBlasHistoryUserId: user.userId,
                waBlasHistoryUserPhone: user.userPhoneNumber,
                waBlasHistoryUserName: user.userName,
                waBlasHistoryMessage: req.body.whatsAppMessage,
            };
            await waBlasHistory_1.WaBlasHistoryModel.create(payload);
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
    const baseUrlPath = "https://pati.wablas.com/api/send-message?phone=";
    const apiUrl = `${baseUrlPath}${whatsAppNumber}&message=${message}&token=${config_1.CONFIG.waBlasToken}`;
    try {
        console.log(whatsAppNumber);
        console.log(message);
        await axios_1.default.get(apiUrl);
    }
    catch (error) {
        console.log("Error:", error.message);
    }
};
