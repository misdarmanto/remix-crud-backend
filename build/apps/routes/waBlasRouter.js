"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waBlasRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const findWaBlasSettings_1 = require("../controllers/waBlass/findWaBlasSettings");
const createOrUpdateWaBlasSettings_1 = require("../controllers/waBlass/createOrUpdateWaBlasSettings");
const sendMessage_1 = require("../controllers/waBlass/sendMessage");
const sendMessageTest_1 = require("../controllers/waBlass/sendMessageTest");
const history_1 = require("../controllers/waBlass/history");
const waBlasRouter = (app) => {
    const router = express_1.default.Router();
    app.use("/wa-blas", middlewares_1.middleware.useAuthorization, router);
    router.post("/send-message", (req, res) => (0, sendMessage_1.waBlasSendMessage)(req, res));
    router.get("/history", (req, res) => (0, history_1.waBlasHistoryFindAll)(req, res));
    router.get("/settings", (req, res) => (0, findWaBlasSettings_1.findWaBlasSettings)(req, res));
    router.patch("/settings", (req, res) => (0, createOrUpdateWaBlasSettings_1.createOrUpdateWaBlassSettings)(req, res));
    router.post("/send-message-test", (req, res) => (0, sendMessageTest_1.waBlasSendMessageTest)(req, res));
};
exports.waBlasRouter = waBlasRouter;
