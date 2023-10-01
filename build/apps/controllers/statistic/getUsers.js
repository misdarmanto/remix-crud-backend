"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersStatistic = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const users_1 = require("../../models/users");
const requestChecker_1 = require("../../utilities/requestChecker");
const pagination_1 = require("../../utilities/pagination");
const getUsersStatistic = async (req, res) => {
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ['desaId'],
        requestData: req.query
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    console.log(req.query);
    try {
        const page = new pagination_1.Pagination(+req.query.page || 0, +req.query.size || 10);
        const result = await users_1.UsersModel.findAndCountAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                userDesaId: req.query.desaId,
                ...(req.query.search && {
                    [sequelize_1.Op.or]: [
                        { userName: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
                        { userPhoneNumber: { [sequelize_1.Op.like]: `%${req.query.search}%` } }
                    ]
                })
            },
            attributes: [
                'userId',
                'userName',
                'userDetailAddress',
                'userDesa',
                'userDesaId',
                'userKecamatan',
                'userKecamatanId',
                'userKabupaten',
                'userKabupatenId',
                'userPhoneNumber',
                'userPosition',
                'userReferrerName',
                'userReferrerPosition',
                'createdOn'
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
exports.getUsersStatistic = getUsersStatistic;
