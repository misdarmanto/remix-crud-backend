"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADDRESS = void 0;
const create_1 = require("./create");
const delete_1 = require("./delete");
const get_1 = require("./get");
const update_1 = require("./update");
exports.ADDRESS = {
    get: get_1.getAddress,
    getByQuery: get_1.getAddressByQuery,
    create: create_1.createAddress,
    update: update_1.updateAddress,
    delete: delete_1.deleteAddress,
};
