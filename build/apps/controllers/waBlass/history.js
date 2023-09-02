"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waBlasHistoryFindOne = exports.waBlasHistoryFindAll = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const pagination_1 = require("../../utilities/pagination");
const requestChecker_1 = require("../../utilities/requestChecker");
const waBlasHistory_1 = require("../../models/waBlasHistory");
const waBlasHistoryFindAll = async (req, res) => {
    try {
        const page = new pagination_1.Pagination(+req.query.page || 0, +req.query.size || 10);
        const result = await waBlasHistory_1.WaBlasHistoryModel.findAndCountAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                ...(req.query.search && {
                    [sequelize_1.Op.or]: [
                        { waBlasHistoryUserName: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
                        {
                            waBlasHistoryUserPhone: {
                                [sequelize_1.Op.like]: `%${req.query.search}%`,
                            },
                        },
                    ],
                }),
            },
            order: [["id", "desc"]],
            ...(req.query.pagination == "true" && {
                limit: page.limit,
                offset: page.offset,
            }),
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
exports.waBlasHistoryFindAll = waBlasHistoryFindAll;
const waBlasHistoryFindOne = async (req, res) => {
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["waBlasHistoryId"],
        requestData: req.params,
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const waBlasHistory = await waBlasHistory_1.WaBlasHistoryModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                waBlasHistoryId: { [sequelize_1.Op.eq]: req.params.waBlasHistoryId },
            },
        });
        if (!waBlasHistory) {
            const message = `not found!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        const response = response_1.ResponseData.default;
        response.data = waBlasHistory;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.waBlasHistoryFindOne = waBlasHistoryFindOne;
