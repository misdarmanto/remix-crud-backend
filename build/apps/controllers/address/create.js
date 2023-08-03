"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAddress = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const requestChecker_1 = require("../../utilities/requestChecker");
const address_1 = require("../../models/mysql/users/address");
const createAddress = async (req, res) => {
    const body = req.body;
    const requireList = [
        "x-user-id",
        "phone",
        "province_name",
        "province_id",
        "city_name",
        "city_id",
        "postal_code",
        "detail",
    ];
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: requireList,
        requestData: { ...req.body, ...req.headers },
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const address = await address_1.AddressModel.create({ ...body, user_id: req.header("x-user-id") });
        const response = response_1.ResponseData.default;
        response.data = address;
        return res.status(http_status_codes_1.StatusCodes.CREATED).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `Tidak dapat memproses permintaan. Laporkan kendala ini. error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.createAddress = createAddress;
