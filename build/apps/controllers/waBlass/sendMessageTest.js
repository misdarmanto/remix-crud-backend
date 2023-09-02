"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waBlasSendMessageTest = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
const data_1 = require("./data");
const waBlasSendMessageTest = async (req, res) => {
    try {
        for (let i = 0; data_1.WA_BLAS_DATA.length > i; i++) {
            console.log(`name: ${data_1.WA_BLAS_NAME[i]}  wa : ${data_1.WA_BLAS_DATA[i]}`);
            await handleSendWhatsAppMessage({
                whatsAppNumber: data_1.WA_BLAS_DATA[i],
                message: `halo Mas, saya Putri dari mendigitalkan.com. Apakah *${data_1.WA_BLAS_NAME[i]}* butuh dibuatkan website atau aplikasi yg lainnya? kalau boleh kami bisa bantu buatkan`,
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
exports.waBlasSendMessageTest = waBlasSendMessageTest;
const handleSendWhatsAppMessage = async ({ message, whatsAppNumber, }) => {
    const baseUrlPath = "https://pati.wablas.com/api/send-message?phone=";
    const apiUrl = `${baseUrlPath}${whatsAppNumber}&message=${message}&token=${config_1.CONFIG.waBlasToken}`;
    try {
        await axios_1.default.get(apiUrl);
    }
    catch (error) {
        console.log("Error:", error.message);
    }
};
