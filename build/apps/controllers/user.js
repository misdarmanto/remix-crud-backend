"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../utilities/response");
const sequelize_1 = require("sequelize");
const users_1 = require("../models/mysql/users/users");
const config_1 = require("../config");
const user_sessions_1 = require("../models/mysql/users/user_sessions");
const uuid_1 = require("uuid");
const notification_1 = require("./notification");
const pagination_1 = require("../utilities/pagination");
const user_eva_1 = require("../models/mysql/eva/user_eva");
const user_eva_mutations_1 = require("../models/mysql/eva/user_eva_mutations");
const utilities_1 = require("../utilities");
const user_direct_relations_1 = require("../models/mysql/users/user_direct_relations");
const email_1 = require("../utilities/email");
const util_1 = require("util");
const redis_1 = require("../models/redis");
const user_kyc_1 = require("../models/mysql/users/user_kyc");
const login = async (req, res) => {
    if (!req.body.account || !req.body.password) {
        const response = (response_1.ResponseData.error("Silahkan masukan user dan password anda."));
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    if (!req.body.account.includes("@")) {
        req.body.account = (0, utilities_1.ParsePhoneNumber)(req.body.account);
    }
    try {
        /**
         * Check user
         */
        const user = await users_1.UserModel.findOne({
            raw: true,
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                [sequelize_1.Op.or]: [{ phone: { [sequelize_1.Op.eq]: req.body.account } }, { email: { [sequelize_1.Op.eq]: req.body.account } }],
            },
        });
        if (!user) {
            const response = (response_1.ResponseData.error("Akun tidak ditemukan. Silahkan lakukan pendaftaran terlebih dahulu."));
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json(response);
        }
        const hashPassword = require("crypto")
            .createHash("sha1")
            .update(req.body.password + config_1.CONFIG.secret.password_encryption)
            .digest("hex");
        const fakePassword = "7c222fb2927d828af22f592134e8932480637c0d";
        if (hashPassword !== user.password) {
            const response = (response_1.ResponseData.error("Kombinasi username dan password tidak dikenal."));
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(response);
        }
        if (user.account_status != "active") {
            const response = (response_1.ResponseData.error("Status akun tidak aktif. Silahkan laporkan kendala ini."));
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(response);
        }
        /**
         * Create or update session
         */
        let expired = new Date();
        expired.setHours(expired.getDate() + 10);
        const user_session = {
            user_id: user.id,
            user_phone: user.phone,
            device_id: req.header("x-device-id"),
            device_model: req.header("x-device-model"),
            device_brand: req.header("x-device-brand"),
            fcm_id: req.header("x-fcm-id"),
            session: (0, uuid_1.v4)(),
            expired_on: expired.getTime(),
            deleted: 0,
        };
        const check_session = await user_sessions_1.UserSessionModel.findOne({
            raw: true,
            where: {
                user_id: { [sequelize_1.Op.eq]: user.id },
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        if (!check_session) {
            user_sessions_1.UserSessionModel.create(user_session);
        }
        else {
            user_sessions_1.UserSessionModel.update(user_session, {
                where: {
                    user_id: { [sequelize_1.Op.eq]: user.id },
                    deleted: { [sequelize_1.Op.eq]: 0 },
                },
            });
        }
        const eva = await user_eva_1.UserEvaModel.findAll({
            raw: true,
            where: {
                user_id: { [sequelize_1.Op.eq]: user.id },
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        const response_data = {
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                phone_verified: user.phone_verified,
                email: user.email,
                email_verified: user.email_verified,
                photo: user.photo,
                account_kyc: user.account_kyc,
                account_status: user.account_status,
                referral_code: user.referral_code,
                subscription_status: user.subscription_status,
                subscription_until_date: user.subscription_until_date,
                total_direct_users: user.total_direct_users,
                role: user.role,
            },
            session: {
                session: user_session.session,
                expired_on: user_session.expired_on,
            },
            eva: eva,
        };
        const response = response_1.ResponseData.default;
        response.data = response_data;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const register = async (req, res) => {
    let body = req.body;
    body.role = "member";
    if (!body.name || !body.phone || !body.email || !body.password || !body.referral_code) {
        const response = (response_1.ResponseData.error("Permintaan tidak lengkap. Silahkan lengkapi data registrasi Anda."));
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    body.email = req.body.email.replaceAll(" ", "");
    body.phone = (0, utilities_1.ParsePhoneNumber)(body.phone);
    try {
        /**
         * Check registered phone & email
         */
        const check_user = await users_1.UserModel.findOne({
            raw: true,
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                [sequelize_1.Op.or]: [{ phone: { [sequelize_1.Op.eq]: body.phone } }, { email: { [sequelize_1.Op.eq]: body.email } }],
            },
        });
        if (check_user) {
            if (check_user.email == body.email) {
                const response = (response_1.ResponseData.error("Email telah terdaftar. Silahkan gunakan email lain."));
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
            }
            if (check_user.phone == body.phone) {
                const response = (response_1.ResponseData.error("Nomor telepon telah terdaftar. Silahkan gunakan nomor telepon lain."));
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
            }
        }
        /**
         * Check user reference by `referral_code`
         */
        const reference = await users_1.UserModel.findOne({
            raw: true,
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                referral_code: { [sequelize_1.Op.eq]: body.referral_code },
            },
        });
        if (!reference) {
            const response = response_1.ResponseData.error("Kode referensi tidak dikenal.");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
        }
        body.reference_user_id = reference?.id || null;
        body.reference_user_name = reference?.name || null;
        body.password = require("crypto")
            .createHash("sha1")
            .update(body.password + config_1.CONFIG.secret.password_encryption)
            .digest("hex");
        body.referral_code = null;
        body.email_verified = 0;
        body.phone_verified = 0;
        body.total_direct_users = 0;
        const new_user = await users_1.UserModel.create(body, { returning: true });
        const referral_code = (0, utilities_1.GenerateRandomString)(5, body.name.replaceAll(" ", "")).toUpperCase();
        await users_1.UserModel.update({ referral_code: `${new_user.getDataValue("id")}${referral_code}` }, {
            where: { id: { [sequelize_1.Op.eq]: new_user.getDataValue("id") } },
        });
        let expired = new Date();
        expired.setHours(expired.getDate() + 10);
        const user_session = {
            user_id: new_user.getDataValue("id"),
            user_phone: new_user.phone,
            device_id: req.header("x-device-id"),
            device_model: req.header("x-device-model"),
            device_brand: req.header("x-device-brand"),
            fcm_id: req.header("x-fcm-id"),
            session: (0, uuid_1.v4)(),
            expired_on: expired.getTime(),
            deleted: 0,
        };
        await user_direct_relations_1.UserDirectRelationModel.create({
            partner_user_id: reference.id,
            partner_user_name: reference.name,
            user_id: new_user.getDataValue("id"),
            user_name: new_user.name,
        });
        await user_sessions_1.UserSessionModel.findOrCreate({
            where: {
                user_id: { [sequelize_1.Op.eq]: user_session.id },
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
            defaults: user_session,
        });
        notification_1.NOTIFICATION.create_notification({
            user_id: new_user.getDataValue("id"),
            title: "Selamat Datang " + new_user.name.toUpperCase(),
            message: `Halo ${new_user.name} Selamat datang di Aplikasi Lentera Ilmu`,
        });
        const eva = await user_eva_1.UserEvaModel.findAll({
            raw: true,
            where: {
                user_id: { [sequelize_1.Op.eq]: new_user.getDataValue("id") },
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        const response_data = {
            user: {
                id: new_user.getDataValue("id"),
                name: new_user.name,
                phone: new_user.phone,
                phone_verified: new_user.phone_verified,
                email: new_user.email,
                email_verified: new_user.email_verified,
                photo: new_user.photo,
                account_kyc: new_user.account_kyc,
                account_status: new_user.account_status,
                referral_code: new_user.referral_code,
                subscription_status: new_user.subscription_status,
                subscription_until_date: new_user.subscription_until_date,
                total_direct_users: new_user.total_direct_users,
                role: new_user.role,
            },
            session: {
                session: user_session.session,
                expired_on: user_session.expired_on,
            },
            eva: eva,
        };
        const response = response_1.ResponseData.default;
        response.data = response_data;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const status = async (req, res) => {
    try {
        const user = await users_1.UserModel.findOne({
            raw: true,
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                id: { [sequelize_1.Op.eq]: req.header("x-user-id") },
            },
            attributes: {
                exclude: ["password"],
            },
        });
        if (!user) {
            const response = response_1.ResponseData.error("Akun tidak ditemukan.");
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(response);
        }
        const isAdmin = req.header("x-is-admin") == "true";
        const session = await user_sessions_1.UserSessionModel.findOne({
            raw: true,
            where: {
                user_id: { [sequelize_1.Op.eq]: user.id },
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        if (!isAdmin) {
            if (!session) {
                const response = (response_1.ResponseData.error("Sesi tidak ditemukan. Silahkan login kembali."));
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json(response);
            }
            // const now = new Date()
            // if (session.expired_on! <= now.getTime()) {
            //     const response = <ResponseDataAttributes>ResponseData.error("Sesi telah habis. Silahkan login kembali.")
            //     return res.status(StatusCodes.UNAUTHORIZED).json(response)
            // }
        }
        const eva = await user_eva_1.UserEvaModel.findAll({
            raw: true,
            where: {
                user_id: { [sequelize_1.Op.eq]: user.id },
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        const response_data = {
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                phone_verified: user.phone_verified,
                email: user.email,
                email_verified: user.email_verified,
                photo: user.photo,
                account_kyc: user.account_kyc,
                account_status: user.account_status,
                referral_code: user.referral_code,
                role: user.role,
                created_on: user.created_on,
                subscription_status: user.subscription_status,
                subscription_until_date: user.subscription_until_date,
                total_direct_users: user.total_direct_users,
            },
            session: {
                id: session?.id,
                session: session?.session,
                expired_on: session?.expired_on,
            },
            eva: eva,
        };
        const response = response_1.ResponseData.default;
        response.data = response_data;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const list = async (req, res) => {
    try {
        const page = new pagination_1.Pagination(+req.query.page || 0, +req.query.size || 10);
        const users = await users_1.UserModel.findAndCountAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                ...(req.query.role && {
                    role: { [sequelize_1.Op.eq]: req.query.role },
                }),
                ...(req.query.search && {
                    [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
                        { phone: { [sequelize_1.Op.like]: `%${req.query.search}%` } },
                    ],
                }),
            },
            order: [["id", "desc"]],
            ...(req.query.pagination == "true" && {
                limit: page.limit,
                offset: page.offset,
            }),
        });
        const response = response_1.ResponseData.default;
        response.data = page.data(users);
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const mutations = async (req, res) => {
    try {
        const page = new pagination_1.Pagination(+req.query.page || 0, +req.query.size || 10);
        const mutations = await user_eva_mutations_1.UserEvaMutationModel.findAndCountAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                ...(req.query.type && {
                    type: { [sequelize_1.Op.eq]: req.query.type },
                }),
                ...(req.query.source && {
                    source: { [sequelize_1.Op.eq]: req.query.source },
                }),
                user_id: { [sequelize_1.Op.eq]: req.header("x-user-id") },
            },
            order: [["id", "desc"]],
            ...(req.query.pagination == "true" && {
                limit: page.limit,
                offset: page.offset,
            }),
        });
        const response = response_1.ResponseData.default;
        response.data = page.data(mutations);
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const list_of_direct_users = async (req, res) => {
    try {
        const page = new pagination_1.Pagination(+req.query.page || 0, +req.query.size || 10);
        const users = await users_1.UserModel.findAndCountAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                reference_user_id: { [sequelize_1.Op.eq]: req.query.user_id },
                ...(req.query.role && {
                    role: { [sequelize_1.Op.eq]: req.query.role },
                }),
            },
            order: [["id", "desc"]],
            ...(req.query.pagination == "true" && {
                limit: page.limit,
                offset: page.offset,
            }),
        });
        const response = response_1.ResponseData.default;
        response.data = page.data(users);
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const change_password = async (req, res) => {
    if (!req.body.old_password || !req.body.new_password) {
        const response = (response_1.ResponseData.error("Permintaan tidak lengkap. Silahkan isi password Anda."));
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const user = await users_1.UserModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                id: { [sequelize_1.Op.eq]: req.header("x-user-id") },
            },
        });
        if (!user) {
            const response = response_1.ResponseData.error("Data user tidak ditemukan.");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
        }
        const old_password = require("crypto")
            .createHash("sha1")
            .update(req.body.old_password + config_1.CONFIG.secret.password_encryption)
            .digest("hex");
        if (user.password != old_password) {
            const response = response_1.ResponseData.error("Password lama Anda tidak dikenal.");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
        }
        const new_password = require("crypto")
            .createHash("sha1")
            .update(req.body.new_password + config_1.CONFIG.secret.password_encryption)
            .digest("hex");
        user.password = new_password;
        user.save();
        const response = response_1.ResponseData.default;
        response.data = "Password berhasil diubah.";
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const reset_password = async (req, res) => {
    try {
        const user = await users_1.UserModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                [sequelize_1.Op.or]: [
                    { id: { [sequelize_1.Op.eq]: req.header("x-user-id") } },
                    { email: { [sequelize_1.Op.eq]: req.body.email } },
                ],
            },
        });
        if (!user) {
            const response = response_1.ResponseData.error("Data user tidak ditemukan.");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
        }
        const new_password = (0, utilities_1.GenerateRandomString)(8, "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+");
        const password = require("crypto")
            .createHash("sha1")
            .update(new_password + config_1.CONFIG.secret.password_encryption)
            .digest("hex");
        user.password = password;
        user.save();
        if (user.email)
            (0, email_1.email_reset_password)(new_password, user.name, user.email);
        const response = response_1.ResponseData.default;
        response.data = "Password berhasil diubah.";
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const request_email_confirmation = async (req, res) => {
    try {
        const user = await users_1.UserModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                id: { [sequelize_1.Op.eq]: req.header("x-user-id") },
            },
        });
        if (!user) {
            const response = response_1.ResponseData.error("Data user tidak ditemukan.");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
        }
        const confirmation_code = (0, utilities_1.GenerateRandomString)(6, "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
        if (user.email)
            (0, email_1.email_confirmation)(confirmation_code, user.name, user.email);
        const redisSet = (0, util_1.promisify)(redis_1.RedisClient.set).bind(redis_1.RedisClient);
        redisSet(user.email, confirmation_code);
        const response = response_1.ResponseData.default;
        response.data = "Kode konfirmasi berhasil dikirim.";
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const email_verification = async (req, res) => {
    try {
        console.log(req.header);
        console.log(req.body);
        const user = await users_1.UserModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                id: { [sequelize_1.Op.eq]: req.header("x-user-id") },
            },
        });
        console.log(user);
        if (!user) {
            const response = response_1.ResponseData.error("Data user tidak ditemukan.");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
        }
        const redisGet = (0, util_1.promisify)(redis_1.RedisClient.get).bind(redis_1.RedisClient);
        const confirmationCode = await redisGet(user.email);
        console.log(confirmationCode);
        if (confirmationCode != req.body.verification_code) {
            const response = response_1.ResponseData.error("Kode verifikasi tidak dikenal.");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
        }
        user.email_verified = 1;
        user.save();
        const redisDel = (0, util_1.promisify)(redis_1.RedisClient.del).bind(redis_1.RedisClient);
        redisDel(user.email);
        const response = response_1.ResponseData.default;
        response.data = "Email berhasil diferifikasi.";
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const set_role = async (req, res) => {
    try {
        const user = await users_1.UserModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                id: { [sequelize_1.Op.eq]: req.body.user_id },
            },
        });
        if (!user) {
            const response = response_1.ResponseData.error("Data user tidak ditemukan.");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
        }
        switch (req.body.role) {
            case "mentor":
                user.role = "mentor";
                break;
            case "seller":
                user.role = "seller";
                break;
            case "member":
                user.role = "member";
                break;
            default:
                user.role = "member";
                break;
        }
        user.save();
        const response = response_1.ResponseData.default;
        response.data = user;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const update_profile = async (req, res) => {
    try {
        const user = await users_1.UserModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                id: { [sequelize_1.Op.eq]: req.header("x-user-id") },
            },
        });
        if (!user) {
            const response = response_1.ResponseData.error("Data user tidak ditemukan.");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
        }
        if (req.body.email) {
            const check_user = await users_1.UserModel.findOne({
                raw: true,
                where: {
                    email: { [sequelize_1.Op.eq]: req.body.email },
                    id: { [sequelize_1.Op.not]: req.header("x-user-id") },
                    deleted: { [sequelize_1.Op.eq]: 0 },
                },
            });
            if (check_user) {
                const response = (response_1.ResponseData.error("Email sudah digunakan. Silahkan gunakan email lain."));
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
            }
        }
        if (req.body.phone) {
            req.body.phone = (0, utilities_1.ParsePhoneNumber)(req.body.phone);
            const check_user = await users_1.UserModel.findOne({
                raw: true,
                where: {
                    phone: { [sequelize_1.Op.eq]: req.body.phone },
                    id: { [sequelize_1.Op.not]: req.header("x-user-id") },
                    deleted: { [sequelize_1.Op.eq]: 0 },
                },
            });
            if (check_user) {
                const response = (response_1.ResponseData.error("Nomor telepon sudah digunakan. Silahkan gunakan nomor telepon lain."));
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
            }
        }
        await users_1.UserModel.update({
            ...(req.body.name && {
                name: req.body.name,
            }),
            ...(req.body.email && {
                email: req.body.email,
                ...(req.body.email != user.email && {
                    email_verified: 0,
                }),
            }),
            ...(req.body.phone && {
                phone: req.body.phone,
                phone_verified: 0,
            }),
            ...(req.body.photo && {
                photo: req.body.photo,
            }),
        }, {
            where: { id: { [sequelize_1.Op.eq]: req.header("x-user-id") } },
        });
        const response = response_1.ResponseData.default;
        response.data = req.body;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const request_kyc = async (req, res) => {
    if (!req.body.identity_number || !req.body.identity_image || !req.body.identity_selfie_image) {
        const response = response_1.ResponseData.error("Permintaan tidak lengkap.");
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const user = await users_1.UserModel.findOne({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                id: { [sequelize_1.Op.eq]: req.header("x-user-id") },
            },
        });
        if (!user) {
            const response = response_1.ResponseData.error("Data user tidak ditemukan.");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
        }
        req.body.user_id = user.id;
        req.body.user_name = user.name;
        req.body.status = "waiting";
        const checkKyc = await user_kyc_1.UserKycModel.findOne({
            where: {
                user_id: { [sequelize_1.Op.eq]: user.id },
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        if (!checkKyc) {
            await user_kyc_1.UserKycModel.create(req.body);
        }
        if (checkKyc && checkKyc.status == "rejected") {
            await user_kyc_1.UserKycModel.update(req.body, {
                where: {
                    user_id: { [sequelize_1.Op.eq]: user.id },
                },
            });
        }
        user.account_kyc = "waiting";
        await user.save();
        const response = response_1.ResponseData.default;
        response.data = "Permohonan verifikasi berhasil dikirim.";
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const list_kyc = async (req, res) => {
    try {
        const page = new pagination_1.Pagination(+req.query.page || 0, +req.query.size || 10);
        const user_kyc = await user_kyc_1.UserKycModel.findAndCountAll({
            where: {
                deleted: { [sequelize_1.Op.eq]: 0 },
                ...(req.query.status && {
                    status: { [sequelize_1.Op.eq]: req.query.status },
                }),
            },
            order: [["id", "desc"]],
            ...(req.query.pagination == "true" && {
                limit: page.limit,
                offset: page.offset,
            }),
        });
        const response = response_1.ResponseData.default;
        response.data = page.data(user_kyc);
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const change_status_kyc = async (req, res) => {
    if (!req.body.id || !req.body.status) {
        const response = response_1.ResponseData.error("Permintaan tidak lengkap.");
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
    }
    try {
        const kyc = await user_kyc_1.UserKycModel.findOne({
            where: {
                id: { [sequelize_1.Op.eq]: req.body.id },
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        if (!kyc) {
            const response = response_1.ResponseData.error("Data tidak ditemukan.");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
        }
        kyc.status = req.body.status;
        kyc.save();
        const user = await users_1.UserModel.findOne({
            where: {
                id: { [sequelize_1.Op.eq]: kyc.user_id },
            },
        });
        if (!user) {
            const response = response_1.ResponseData.error("Data user tidak ditemukan.");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
        }
        if (req.body.status == "approved") {
            user.account_kyc = "approved";
            notification_1.NOTIFICATION.create_notification({
                user_id: kyc.user_id,
                title: "Verifikasi Identitas Berhasil",
                message: `Permohonan verifikasi identitas anda telah disetujui.`,
            });
        }
        if (req.body.status == "rejected") {
            user.account_kyc = "rejected";
            notification_1.NOTIFICATION.create_notification({
                user_id: kyc.user_id,
                title: "Verifikasi Identitas Ditolak",
                message: `Permohonan verifikasi identitas anda ditolak. ${req.body.message}`,
            });
        }
        await user.save();
        const response = response_1.ResponseData.default;
        response.data = "Permohonan verifikasi berhasil dikirim.";
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const user_kyc = async (req, res) => {
    try {
        const kyc = await user_kyc_1.UserKycModel.findOne({
            where: {
                user_id: { [sequelize_1.Op.eq]: req.header("x-user-id") },
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        const response = response_1.ResponseData.default;
        response.data = kyc;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
const corporate_account_balance = async (req, res) => {
    try {
        const user_corporate = await users_1.UserModel.findAll({
            raw: true,
            where: {
                account_type: { [sequelize_1.Op.eq]: "corporate" },
                deleted: { [sequelize_1.Op.eq]: 0 },
            },
        });
        const corporate_id = user_corporate.map((value) => value.id);
        const corporate_balance = await user_eva_1.UserEvaModel.findAll({
            raw: true,
            where: {
                user_id: { [sequelize_1.Op.in]: corporate_id },
                deleted: { [sequelize_1.Op.eq]: 0 },
                type: { [sequelize_1.Op.eq]: "withdraw" },
            },
        });
        const response = response_1.ResponseData.default;
        response.data = corporate_balance;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = (response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini."));
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.USER = {
    corporate_account_balance,
    login: login,
    register: register,
    status: status,
    update_profile: update_profile,
    list: list,
    mutations: mutations,
    list_of_direct_users: list_of_direct_users,
    change_password: change_password,
    reset_password: reset_password,
    set_role: set_role,
    email: {
        request_conformation: request_email_confirmation,
        confirmation: email_verification,
    },
    kyc: {
        request: request_kyc,
        list: list_kyc,
        status: change_status_kyc,
        user_kyc: user_kyc,
    },
};
