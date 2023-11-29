"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const uuid_1 = require("uuid");
const users_1 = require("../../models/users");
const requestChecker_1 = require("../../utilities/requestChecker");
const response_1 = require("../../utilities/response");
const desa_1 = require("../../models/desa");
const sequelize_1 = require("sequelize");
const createUser = async (req, res) => {
    const requestBody = req.body;
    const emptyField = (0, requestChecker_1.requestChecker)({
        requireList: [
            'userName',
            'userDetailAddress',
            'userDesa',
            'userDesaId',
            'userKecamatan',
            'userKecamatanId',
            'userKabupaten',
            'userKabupatenId',
            'userPosition'
        ],
        requestData: requestBody
    });
    if (emptyField) {
        const message = `mohon lengkapi data berikut(${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        // const user = await UsersModel.findOne({
        //   where: {
        //     deleted: { [Op.eq]: 0 },
        //     userPhoneNumber: { [Op.eq]: requestBody.userPhoneNumber }
        //   }
        // })
        // if (user) {
        //   const message = `nomor WA sudah terdaftar`
        //   const response = <ResponseDataAttributes>ResponseData.error(message)
        //   return res.status(StatusCodes.NOT_FOUND).json(response)
        // }
        await desa_1.DesaModel.update({
            isRegistered: true
        }, {
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                desaId: { [sequelize_1.Op.eq]: requestBody.userDesaId }
            }
        });
        requestBody.userId = (0, uuid_1.v4)();
        await users_1.UsersModel.create(requestBody);
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
exports.createUser = createUser;
