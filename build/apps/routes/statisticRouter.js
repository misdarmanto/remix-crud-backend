"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statisticRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const getKabupaten_1 = require("../controllers/statistic/getKabupaten");
const getKecamatan_1 = require("../controllers/statistic/getKecamatan");
const getDesa_1 = require("../controllers/statistic/getDesa");
const getUsers_1 = require("../controllers/statistic/getUsers");
const statisticRouter = (app) => {
    const router = express_1.default.Router();
    app.use("/statistic", middlewares_1.middleware.useAuthorization, router);
    router.get("/", (req, res) => (0, getKabupaten_1.getKabupatenStatistic)(req, res));
    router.get("/kecamatan", (req, res) => (0, getKecamatan_1.getKecamatanStatistic)(req, res));
    router.get("/users", (req, res) => (0, getUsers_1.getUsersStatistic)(req, res));
    router.get("/desa", (req, res) => (0, getDesa_1.getDesaStatistic)(req, res));
};
exports.statisticRouter = statisticRouter;
