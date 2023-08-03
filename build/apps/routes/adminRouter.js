"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const find_1 = require("../controllers/admin/find");
const login_1 = require("../controllers/admin/login");
const creat_1 = require("../controllers/admin/creat");
const update_1 = require("../controllers/admin/update");
const remove_1 = require("../controllers/admin/remove");
const adminRouter = (app) => {
    const router = express_1.default.Router();
    app.use("/admins", middlewares_1.middleware.useAuthorization, router);
    router.get("/list", (req, res) => (0, find_1.findAllAdmin)(req, res));
    router.get("/detail/:adminId", (req, res) => (0, find_1.findOneAdmin)(req, res));
    router.post("/login", (req, res) => (0, login_1.loginAdmin)(req, res));
    router.post("/", (req, res) => (0, creat_1.createAdmin)(req, res));
    router.patch("/", (req, res) => (0, update_1.updateAdmin)(req, res));
    router.delete("/", (req, res) => (0, remove_1.removeAdmin)(req, res));
};
exports.adminRouter = adminRouter;
