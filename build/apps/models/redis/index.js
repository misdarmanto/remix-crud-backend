"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisClient = void 0;
const databases_1 = require("../../config/databases");
const rPort = +databases_1.DATABASES.redis.port || 6379;
const rHost = databases_1.DATABASES.redis.host || "127.0.0.1";
const redis = require("redis");
const RedisClient = redis.createClient(rPort, rHost);
exports.RedisClient = RedisClient;
RedisClient.on("connect", function () {
    console.log("** Redis client connected **");
});
RedisClient.on("error", function (err) {
    console.log(`** Something went wrong: ${err}`);
});
