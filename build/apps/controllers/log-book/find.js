"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOne = exports.findAll = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const sequelize_1 = require("sequelize");
const pagination_1 = require("../../utilities/pagination");
const requestCheker_1 = require("../../utilities/requestCheker");
const user_1 = require("../../models/user");
const log_book_1 = require("../../models/log-book");
const active_semester_1 = require("../../utilities/active-semester");
const findAll = async (req, res) => {
    const emptyField = (0, requestCheker_1.requestChecker)({
        requireList: ["x-user-id"],
        requestData: req.headers,
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const user = await user_1.UserModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                userId: { [sequelize_1.Op.eq]: req.header("x-user-id") },
            },
        });
        if (!user) {
            const message = `user not registered!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(response);
        }
        const activeSemester = await (0, active_semester_1.getActiveSemester)();
        const page = new pagination_1.Pagination(+req.query.page || 0, +req.query.size || 10);
        const result = await log_book_1.LogBookModel.findAndCountAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                logBookSemesterId: { [sequelize_1.Op.eq]: activeSemester?.semesterId },
                ...(req.query.search && {
                    [sequelize_1.Op.or]: [
                        { logBookStudentName: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
                    ],
                }),
                ...(user.userRole === "student" && {
                    logBookStudentId: { [sequelize_1.Op.eq]: user.userId },
                }),
                ...(user.userRole === "studyProgram" && {
                    logBookStudyProgramId: {
                        [sequelize_1.Op.eq]: user.userId,
                    },
                }),
                ...(user.userRole === "department" && {
                    logBookDepartmentId: {
                        [sequelize_1.Op.eq]: user.userId,
                    },
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
exports.findAll = findAll;
const findOne = async (req, res) => {
    const params = req.params;
    const emptyField = (0, requestCheker_1.requestChecker)({
        requireList: ["id"],
        requestData: req.params,
    });
    if (emptyField) {
        const message = `invalid request parameter! require (${emptyField})`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const user = await user_1.UserModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                userId: { [sequelize_1.Op.eq]: req.header("x-user-id") },
            },
        });
        if (!user) {
            const message = `student not found!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        const activeSemester = await (0, active_semester_1.getActiveSemester)();
        const logBook = await log_book_1.LogBookModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                logBookSemesterId: { [sequelize_1.Op.eq]: activeSemester?.semesterId },
                logBookId: { [sequelize_1.Op.eq]: params.id },
                ...(user.userRole === "student" && {
                    logBookStudentId: { [sequelize_1.Op.eq]: user.userId },
                }),
                ...(user.userRole === "studyProgram" && {
                    logBookStudyProgramId: {
                        [sequelize_1.Op.eq]: user.userId,
                    },
                }),
                ...(user.userRole === "department" && {
                    logBookDepartmentId: {
                        [sequelize_1.Op.eq]: user.userId,
                    },
                }),
            },
        });
        if (!logBook) {
            const message = `not found!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        const response = response_1.ResponseData.default;
        response.data = logBook;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.findOne = findOne;
