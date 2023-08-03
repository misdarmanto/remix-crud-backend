"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuperAdmin = void 0;
const sequelize_1 = require("sequelize");
const admins_1 = require("../models/admins");
const isSuperAdmin = async ({ adminId }) => {
    try {
        const checkAdmin = await admins_1.AdminModel.findOne({
            raw: true,
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                adminId: { [sequelize_1.Op.eq]: adminId },
                adminRole: { [sequelize_1.Op.eq]: "superAdmin" },
            },
        });
        if (checkAdmin) {
            return checkAdmin;
        }
        return false;
    }
    catch (error) {
        throw error;
    }
};
exports.isSuperAdmin = isSuperAdmin;
