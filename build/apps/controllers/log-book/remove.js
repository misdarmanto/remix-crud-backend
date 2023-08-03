"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const requestCheker_1 = require("../../utilities/requestCheker");
const log_book_1 = require("../../models/log-book");
const student_1 = require("../../models/student");
const remove = async (req, res) => {
    const emptyField = (0, requestCheker_1.requestChecker)({
        requireList: ["logBookId"],
        requestData: req.query,
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const student = await student_1.StudentModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                studentId: { [sequelize_1.Op.eq]: req.header("x-user-id") },
            },
        });
        if (!student) {
            const message = `access denied!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(response);
        }
        const logBook = await log_book_1.LogBookModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                logBookId: { [sequelize_1.Op.eq]: req.query.logBookId },
            },
        });
        if (!logBook) {
            const message = `not found!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        await log_book_1.LogBookModel.update({ deleted: 1 }, {
            where: {
                logBookId: { [sequelize_1.Op.eq]: req.query.logBookId },
            },
        });
        const response = response_1.ResponseData.default;
        response.data = { message: "success" };
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.remove = remove;
