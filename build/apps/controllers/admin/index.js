"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const creat_1 = require("./creat");
const findAll_1 = require("./findAll");
const login_1 = require("./login");
const remove_1 = require("./remove");
const update_1 = require("./update");
exports.adminController = {
    createAdmin: creat_1.createAdmin,
    loginAdmin: login_1.loginAdmin,
    findAllAdmin: findAll_1.findAllAdmin,
    removeAdmin: remove_1.removeAdmin,
    updateAdmin: update_1.updateAdmin,
};
