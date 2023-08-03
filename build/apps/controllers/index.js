"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../utilities/response");
const index = async (req, res) => {
    try {
        const data = { message: "Node User Service API." };
        const response = response_1.ResponseData.default;
        response.data = data;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini.");
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.index = index;
