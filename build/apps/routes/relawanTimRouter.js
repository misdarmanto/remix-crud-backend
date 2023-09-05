"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.relawanTimRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const find_1 = require("../controllers/relawan-tim/find");
const create_1 = require("../controllers/relawan-tim/create");
const remove_1 = require("../controllers/relawan-tim/remove");
const update_1 = require("../controllers/relawan-tim/update");
const relawanTimRouter = (app) => {
    const router = express_1.default.Router();
    app.use("/relawan-tim", middlewares_1.middleware.useAuthorization, router);
    router.get("/list", (req, res) => (0, find_1.findAllRelawanTim)(req, res));
    router.get("/all", (req, res) => (0, find_1.allRelawanTim)(req, res));
    router.get("/members/:relawanTimName", (req, res) => (0, find_1.findAllRelawanMember)(req, res));
    router.get("/detail/:id", (req, res) => (0, find_1.findOneRelawanTim)(req, res));
    router.post("/", (req, res) => (0, create_1.createRelawanTim)(req, res));
    router.patch("/", (req, res) => (0, update_1.updateRelawanTim)(req, res));
    router.delete("/", (req, res) => (0, remove_1.removeRelawanTim)(req, res));
};
exports.relawanTimRouter = relawanTimRouter;
