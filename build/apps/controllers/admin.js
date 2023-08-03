"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list_admin = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../utilities/response");
const sequelize_1 = require("sequelize");
const admins_1 = require("../models/admins");
const pagination_1 = require("../utilities/pagination");
const list_admin = async (req, res) => {
    try {
        const page = new pagination_1.Pagination(+req.query.page || 0, +req.query.size || 10);
        const users = await admins_1.AdminModel.findAndCountAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                ...(req.query.role && {
                    role: { [sequelize_1.Op.eq]: req.query.role },
                }),
                ...(req.query.search && {
                    [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
                        { phone: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
                        { email: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
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
        response.data = page.data(users);
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.list_admin = list_admin;
