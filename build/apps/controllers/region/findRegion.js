"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRegion = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const pagination_1 = require("../../utilities/pagination");
const desa_1 = require("../../models/desa");
const kecamatan_1 = require("../../models/kecamatan");
const kabupaten_1 = require("../../models/kabupaten");
const findRegion = async (req, res) => {
    try {
        const page = new pagination_1.Pagination(+req.query.page || 0, +req.query.size || 10);
        const result = await desa_1.DesaModel.findAndCountAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                ...(req.query.search && {
                    [sequelize_1.Op.or]: [{ desaName: { [sequelize_1.Op.like]: `%${req.query.search}%` } }]
                })
            },
            attributes: ['desaName'],
            include: [
                {
                    model: kecamatan_1.KecamatanModel,
                    attributes: ['kecamatanName']
                },
                {
                    model: kabupaten_1.KabupatenModel,
                    attributes: ['kabupatenName']
                }
            ],
            order: [['id', 'desc']],
            ...(req.query.pagination == 'true' && {
                limit: page.limit,
                offset: page.offset
            })
        });
        const response = response_1.ResponseData.default;
        response.data = page.data(result);
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.findRegion = findRegion;
