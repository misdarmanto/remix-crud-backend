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
const waBlasHistory_1 = require("../../models/waBlasHistory");
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const waBlasSettings_1 = require("../../models/waBlasSettings");
const waBlasSendMessage = async (req, res) => {
    try {
        const waBlasSettings = await waBlasSettings_1.WaBlasSettingsModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 }
            }
        });
        if (!waBlasSettings) {
            const message = `pengaturan pesan default tidak ditemukan. mohon buat pengaturan pesan default terlebih dahulu!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        const users = JSON.parse(req.body.userData ?? '');
        for (let user of users) {
            await handleSendWhatsAppMessage({
                whatsAppNumber: user.userPhoneNumber,
                message: waBlasSettings?.waBlasSettingsMessage,
                image: waBlasSettings.waBlasSettingsImage ?? null
            });
            const payload = {
                waBlasHistoryId: (0, uuid_1.v4)(),
                waBlasHistoryUserId: user.userId,
                waBlasHistoryUserPhone: user.userPhoneNumber,
                waBlasHistoryUserName: user.userName,
                waBlasHistoryMessage: waBlasSettings.waBlasSettingsMessage
            };
            await waBlasHistory_1.WaBlasHistoryModel.create(payload);
        }
        const response = response_1.ResponseData.default;
        response.data = { message: 'succsess' };
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
const handleSendWhatsAppMessage = async ({ message, whatsAppNumber, image }) => {
    const baseUrlPath = `${config_1.CONFIG.waBlasBaseUrl}/send-message?phone=`;
    const apiUrl = `${baseUrlPath}${whatsAppNumber}&message=${message}&token=${config_1.CONFIG.waBlasToken}`;
    try {
        if (image) {
            console.log('use image');
            await axios_1.default.post(`${config_1.CONFIG.waBlasBaseUrl}/send-image`, {
                phone: whatsAppNumber,
                caption: message,
                image: image
            }, {
                headers: {
                    Authorization: config_1.CONFIG.waBlasToken
                }
            });
        }
        else {
            console.log('no image');
            await axios_1.default.get(apiUrl);
        }
    }
    catch (error) {
        console.log('Error:', error.message);
    }
};
