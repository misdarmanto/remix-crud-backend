"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_push_notification = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const send_push_notification = (fcmTokens, notification, data) => {
    const fcm_payload = {
        registration_ids: fcmTokens,
        notification: notification,
        data: data,
        apns: {
            payload: { aps: { "mutable-content": 1 } },
            fcm_options: {
                ...notification.image && {
                    image: notification.image
                }
            }
        }
    };
    const fcm_config = {
        headers: {
            'Authorization': 'key=' + config_1.CONFIG.secret.fcm_server_key, 'Content-Type': 'application/json'
        }
    };
    axios_1.default.post('https://fcm.googleapis.com/fcm/send', fcm_payload, fcm_config)
        .then(fcm_response => { console.log(fcm_response.data); return true; }).catch(fcm_error => { return false; });
};
exports.send_push_notification = send_push_notification;
