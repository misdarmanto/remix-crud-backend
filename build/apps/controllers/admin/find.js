"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOneAdmin = exports.findAllAdmin = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const admins_1 = require("../../models/admins");
const pagination_1 = require("../../utilities/pagination");
const requestChecker_1 = require("../../utilities/requestChecker");
const checkAuth_1 = require("../../utilities/checkAuth");
const findAllAdmin = async (req, res) => {
    try {
        const page = new pagination_1.Pagination(+req.query.page || 0, +req.query.size || 10);
        const users = await admins_1.AdminModel.findAndCountAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                adminId: { [sequelize_1.Op.not]: req.header("x-user-id") },
                ...(req.query.search && {
                    [sequelize_1.Op.or]: [
                        { adminName: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
                        { adminEmail: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
                    ],
                }),
            },
            attributes: [
                "adminId",
                "adminName",
                "adminEmail",
                "adminRole",
                "createdOn",
                "modifiedOn",
            ],
            order: [["id", "desc"]],
            ...(req.query.pagination == "true" && {
                limit: page.limit,
                offset: page.offset,
            }),
        });
        const response = response_1.ResponseData.default;
        response.data = page.data(users);
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.findAllAdmin = findAllAdmin;
const findOneAdmin = async (req, res) => {
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: ["adminId", "x-user-id"],
        requestData: { ...req.params, ...req.headers },
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const checkCurrentAdmin = await (0, checkAuth_1.isSuperAdmin)({
            adminId: req.header("x-user-id"),
        });
        if (!checkCurrentAdmin) {
            const message = `access denied!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(response);
        }
        const admin = await admins_1.AdminModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                adminId: { [sequelize_1.Op.eq]: req.params.adminId },
            },
            attributes: [
                "adminId",
                "adminName",
                "adminEmail",
                "adminRole",
                "createdOn",
                "modifiedOn",
            ],
        });
        if (!admin) {
            const message = `admin not found!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        const response = response_1.ResponseData.default;
        response.data = admin;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.findOneAdmin = findOneAdmin;
