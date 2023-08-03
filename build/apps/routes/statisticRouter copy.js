"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statisticRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const statistic_1 = require("../controllers/statistic");
const statisticRouter = (app) => {
    const router = express_1.default.Router();
    app.use("/statistic", middlewares_1.middleware.useAuthorization, router);
    router.get("/", (req, res) => (0, statistic_1.statistic)(req, res));
};
exports.statisticRouter = statisticRouter;
