"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const users_1 = require("../../models/users");
const downloadUser = async (req, res) => {
    try {
        const result = await users_1.UsersModel.findAndCountAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
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
                ...(req.query.searchUserReferrer && {
                    userPosition: { [sequelize_1.Op.eq]: `${req.query.searchUserReferrer}` }
                }),
                ...(req.query.userKabupaten && {
                    userKabupaten: { [sequelize_1.Op.eq]: req.query.userKabupaten }
                }),
                ...(req.query.userKecamatan && {
                    userKecamatan: { [sequelize_1.Op.eq]: req.query.userKecamatan }
                }),
                ...(req.query.userDesa && {
                    userDesa: { [sequelize_1.Op.eq]: req.query.userDesa }
                }),
                ...(req.query.userPosition && {
                    userPosition: { [sequelize_1.Op.eq]: req.query.userPosition }
                }),
                ...(req.query.userName && {
                    userName: { [sequelize_1.Op.eq]: req.query.userName }
                })
            },
            order: [['id', 'desc']]
        });
        const response = response_1.ResponseData.default;
        response.data = result;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.downloadUser = downloadUser;
