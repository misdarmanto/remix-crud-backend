"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../../utilities/response");
const requestCheker_1 = require("../../utilities/requestCheker");
const uuid_1 = require("uuid");
const student_1 = require("../../models/student");
const sequelize_1 = require("sequelize");
const log_book_1 = require("../../models/log-book");
const active_semester_1 = require("../../utilities/active-semester");
const create = async (req, res) => {
    const body = req.body;
    const emptyField = (0, requestCheker_1.requestChecker)({
        requireList: ["x-user-id", "logBookReportFile", "logBookReportWeek"],
        requestData: { ...req.body, ...req.headers },
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
                studentIsRegistered: { [sequelize_1.Op.eq]: true },
            },
        });
        if (!student) {
            const message = `access denied!`;
            const response = response_1.ResponseData.error(message);
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(response);
        }
        const activeSemester = await (0, active_semester_1.getActiveSemester)();
        body.logBookId = (0, uuid_1.v4)();
        body.logBookSemesterId = activeSemester?.semesterId || "";
        body.logBookStudentId = student.studentId;
        body.logBookStudentName = student.studentName;
        body.logBookStudentNim = student.studentNim;
        body.logBookStudyProgramId = student.studentStudyProgramId;
        body.logBookStudyProgramName = student.studentStudyProgramName;
        body.logBookDepartmentId = student.studentDepartmentId;
        body.logBookDepartmentName = student.studentDepartmentName;
        await log_book_1.LogBookModel.create(body);
        const response = response_1.ResponseData.default;
        response.data = { message: "success" };
        return res.status(http_status_codes_1.StatusCodes.CREATED).json(response);
    }
    catch (error) {
        console.log(error.message);
        const message = `unable to process request! error ${error.message}`;
        const response = response_1.ResponseData.error(message);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.create = create;
