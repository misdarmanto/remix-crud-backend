"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const find_1 = require("../controllers/users/find");
const update_1 = require("../controllers/users/update");
const remove_1 = require("../controllers/users/remove");
const create_1 = require("../controllers/users/create");
const referral_1 = require("../controllers/users/referral");
const download_1 = require("../controllers/users/download");
const userRouter = (app) => {
    const router = express_1.default.Router();
    app.use('/users', middlewares_1.middleware.useAuthorization, router);
    router.get('/list', (req, res) => (0, find_1.findAllUsers)(req, res));
    router.get('/download', (req, res) => (0, download_1.downloadUser)(req, res));
    router.get('/referrals', (req, res) => (0, referral_1.findUserReferral)(req, res));
    router.get('/position', (req, res) => (0, find_1.findAllUserByPosition)(req, res));
    router.get('/detail/:userId', (req, res) => (0, find_1.findOneUser)(req, res));
    router.post('/', (req, res) => (0, create_1.createUser)(req, res));
    router.patch('/', (req, res) => (0, update_1.updateUser)(req, res));
    router.delete('/', (req, res) => (0, remove_1.removeUser)(req, res));
};
exports.userRouter = userRouter;
