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
const relawanTimRouter = (app) => {
    const router = express_1.default.Router();
    app.use("/relawan-tim", middlewares_1.middleware.useAuthorization, router);
    router.get("/list", (req, res) => (0, find_1.findAllRelawanTim)(req, res));
    router.get("/detail/:relawanTimId", (req, res) => (0, find_1.findOneRelawanTim)(req, res));
    router.post("/", (req, res) => (0, create_1.createRelawanTim)(req, res));
    // router.patch("/", (req: Request, res: Response) => updateUser(req, res));
    // router.delete("/", (req: Request, res: Response) => removeUser(req, res));
};
exports.relawanTimRouter = relawanTimRouter;
