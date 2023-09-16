"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRegion = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const desa_1 = require("../../models/desa");
const requestChecker_1 = require("../../utilities/requestChecker");
const createRegion = async (req, res) => {
    const requestBody = req.body;
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ['desaName', 'desaId', 'kecamatanId', 'kabupatenId', 'provinceId'],
        requestData: requestBody
    });
    if (emptyField) {
        const message = `mohon lengkapi data berikut(${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        // const newData = <DesaAttributes[]>desaList.map((item, index) => {
        //   return {
        //     desaName: item.name,
        //     desaId: `11415${index + 1}`,
        //     kecamatanId: `11415`,
        //     kabupatenId: '14',
        //     provinceId: '1'
        //   }
        // })
        await desa_1.DesaModel.create(requestBody);
        const response = response_1.ResponseData.default;
        response.data = { message: 'success' };
        return res.status(http_status_codes_1.StatusCodes.CREATED).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.createRegion = createRegion;
