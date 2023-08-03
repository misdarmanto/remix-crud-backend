"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTIFICATION = exports.subscription_reminder = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../utilities/response");
const sequelize_1 = require("sequelize");
const notifications_1 = require("../models/mysql/users/notifications");
const pagination_1 = require("../utilities/pagination");
const push_notification_1 = require("../utilities/push_notification");
const user_sessions_1 = require("../models/mysql/users/user_sessions");
const users_1 = require("../models/mysql/users/users");
const moment_1 = __importDefault(require("moment"));
const cron_logs_1 = require("../models/mysql/users/cron_logs");
const subscription_reminder = async (req, res) => {
    try {
        const users = await users_1.UserModel.findAll({
            raw: true,
            where: {
                [sequelize_1.Op.or]: Array.from(Array(6).keys()).map((value) => {
                    return {
                        subscription_until_date: {
                            [sequelize_1.Op.eq]: `${(0, moment_1.default)().add(value, "days").format("YYYY-MM-DD")}`,
                        },
                    };
                }),
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        const session = await user_sessions_1.UserSessionModel.findAll({
            raw: true,
            where: {
                user_id: { [sequelize_1.Op.in]: users.map((value) => value.id) },
                deleted: { [sequelize_1.Op.eq]: 0 },
                fcm_id: { [sequelize_1.Op.not]: null },
            },
        });
        if (session && session.length > 0) {
            const push_notif_payload = {
                title: "Reminder Program Subscription.",
                body: `Program subscription Anda akan segera berakhir, ayo perpanjang program Anda sekarang.`,
            };
            // const push_notif_data = { click_action: 'ppob', trx_code: trxCode }
            const push_notif_data = {};
            (0, push_notification_1.send_push_notification)(session.map((value) => value.fcm_id), push_notif_payload, push_notif_data);
        }
        await cron_logs_1.CronLogModel.create({
            job: "reminder_subscription",
            data: users.map((value) => ({ name: value.name, subscription_until_date: value.subscription_until_date })),
            deleted: 0
        });
        const response = response_1.ResponseData.default;
        response.data = "ok";
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.subscription_reminder = subscription_reminder;
const get_list_notifications = async (req, res) => {
    try {
        const page = new pagination_1.Pagination(+req.query.page || 0, +req.query.size || 10);
        const notifications = await notifications_1.NotificationModel.findAndCountAll({
            where: {
                ...(req.header("x-user-id") && {
                    user_id: { [sequelize_1.Op.eq]: req.header("x-user-id") },
                }),
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
            order: [["id", "desc"]],
            ...(req.query.pagination == "true" && {
                limit: page.limit,
                offset: page.offset,
            }),
        });
        const response = response_1.ResponseData.default;
        response.data = page.data(notifications);
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const read_notification = async (req, res) => {
    if (!req.header("x-user-id") || !req.query.notification_id) {
        const response = (response_1.ResponseData.error("Permintaan tidak lengkap."));
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const notification = await notifications_1.NotificationModel.findOne({
            where: {
                user_id: { [sequelize_1.Op.eq]: req.header("x-user-id") },
                id: { [sequelize_1.Op.eq]: req.query.notification_id },
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        if (!notification) {
            const response = (response_1.ResponseData.error("Pesan notifikasi tidak ditemukan."));
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        notification.read = 1;
        notification.save();
        const response = response_1.ResponseData.default;
        response.data = notification;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const create_notification = async (notification) => {
    try {
        await notifications_1.NotificationModel.create(notification);
        const session = await user_sessions_1.UserSessionModel.findOne({
            raw: true,
            where: { user_id: { [sequelize_1.Op.eq]: notification.id } },
        });
        if (session?.fcm_id != null) {
            const push_notif_payload = {
                title: notification.title,
                body: notification.message,
            };
            console.log(push_notif_payload);
            // const push_notif_data = { click_action: 'ppob', trx_code: trxCode }
            const push_notif_data = {};
            (0, push_notification_1.send_push_notification)([session?.fcm_id], push_notif_payload, push_notif_data);
        }
    }
    catch (error) {
        console.log(error);
        throw new Error("Gagal membuat notifikasi.");
    }
};
const send_push_notif = async (req, res) => {
    if (!req.body.title || !req.body.message) {
        const response = (response_1.ResponseData.error("Permintaan tidak lengkap."));
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const userSession = await user_sessions_1.UserSessionModel.findAll({
            raw: true,
            where: {
                fcm_id: { [sequelize_1.Op.not]: null },
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        const fcmTargets = userSession.map((value) => value.fcm_id ?? "");
        const push_notif_payload = {
            title: req.body.title,
            body: req.body.message,
        };
        const push_notif_data = {
            ...(req.body.image && {
                image: req.body.image,
            }),
        };
        (0, push_notification_1.send_push_notification)(fcmTargets, push_notif_payload, push_notif_data);
        const response = response_1.ResponseData.default;
        response.data = "ok";
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.NOTIFICATION = {
    get_list_notifications,
    read_notification,
    create_notification,
    send_push_notif,
};
