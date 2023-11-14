"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOneUser = exports.findAllUserByPosition = exports.findAllUsers = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const pagination_1 = require("../../utilities/pagination");
const requestChecker_1 = require("../../utilities/requestChecker");
const users_1 = require("../../models/users");
const findAllUsers = async (req, res) => {
    try {
        const page = new pagination_1.Pagination(+req.query.page || 0, +req.query.size || 10);
        const result = await users_1.UsersModel.findAndCountAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                ...(req.query.searchUserReferrer && {
                    userPosition: { [sequelize_1.Op.eq]: `${req.query.searchUserReferrer}` }
                }),
                ...(req.query.search && {
                    [sequelize_1.Op.or]: [
                        { userName: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
                        { userPhoneNumber: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
                        { userDesa: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
                        { userKecamatan: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
                        { userKabupaten: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
                        { userPosition: { [sequelize_1.Op.like]: `%${req.query.search}%` } }
                    ]
                }),
                ...(req.query.userKabupaten && {
                    userKabupaten: { [sequelize_1.Op.eq]: req.query.userKabupaten }
                }),
                ...(req.query.userKecamatan && {
                    userKecamatan: { [sequelize_1.Op.eq]: req.query.userKecamatan }
                }),
                ...(req.query.kabupatenId && {
                    userKabupatenId: { [sequelize_1.Op.eq]: req.query.kabupatenId }
                }),
                ...(req.query.kecamatanId && {
                    userKecamatanId: { [sequelize_1.Op.eq]: req.query.kecamatanId }
                }),
                ...(req.query.userPosition && {
                    userPosition: { [sequelize_1.Op.eq]: req.query.userPosition }
                })
            },
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
exports.findAllUsers = findAllUsers;
const findAllUserByPosition = async (req, res) => {
    try {
        const page = new pagination_1.Pagination(+req.query.page || 0, +req.query.size || 10);
        const result = await users_1.UsersModel.findAndCountAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                userPosition: { [sequelize_1.Op.eq]: `${req.query.userPosition}` },
                ...(req.query.search && {
                    [sequelize_1.Op.or]: [{ userName: { [sequelize_1.Op.like]: `%${req.query.search}%` } }]
                })
            },
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
exports.findAllUserByPosition = findAllUserByPosition;
const findOneUser = async (req, res) => {
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ['userId'],
        requestData: req.params
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const user = await users_1.UsersModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                userId: { [sequelize_1.Op.eq]: req.params.userId }
            }
        });
        if (!user) {
            const message = `user not found!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        const response = response_1.ResponseData.default;
        response.data = user;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.findOneUser = findOneUser;
