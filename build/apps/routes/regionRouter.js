"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const findKabupaten_1 = require("../controllers/region/findKabupaten");
const findKecamatan_1 = require("../controllers/region/findKecamatan");
const findDesa_1 = require("../controllers/region/findDesa");
const regionRouter = (app) => {
    const router = express_1.default.Router();
    app.use("/region", middlewares_1.middleware.useAuthorization, router);
    router.get("/kabupaten", (req, res) => (0, findKabupaten_1.findKabupaten)(req, res));
    router.get("/kecamatan", (req, res) => (0, findKecamatan_1.findKecamatan)(req, res));
    router.get("/desa", (req, res) => (0, findDesa_1.findDesa)(req, res));
};
exports.regionRouter = regionRouter;
