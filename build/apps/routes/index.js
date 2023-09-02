"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const controllers_1 = require("../controllers");
const adminRouter_1 = require("./adminRouter");
const userRouter_1 = require("./userRouter");
const statisticRouter_1 = require("./statisticRouter");
const regionRouter_1 = require("./regionRouter");
const myProfileRouter_1 = require("./myProfileRouter");
const relawanTimRouter_1 = require("./relawanTimRouter");
const waBlasRouter_1 = require("./waBlasRouter");
const route = (app) => {
    app.get("/", (req, res) => (0, controllers_1.index)(req, res));
    (0, adminRouter_1.adminRouter)(app);
    (0, userRouter_1.userRouter)(app);
    (0, statisticRouter_1.statisticRouter)(app);
    (0, relawanTimRouter_1.relawanTimRouter)(app);
    (0, regionRouter_1.regionRouter)(app);
    (0, myProfileRouter_1.myProfileRouter)(app);
    (0, waBlasRouter_1.waBlasRouter)(app);
};
exports.route = route;
