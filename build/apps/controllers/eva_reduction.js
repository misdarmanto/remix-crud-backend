"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.on_hold_reduction = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../utilities/response");
const sequelize_1 = require("sequelize");
const settings_1 = require("../models/mysql/eva/settings");
const users_1 = require("../models/mysql/users/users");
const cron_logs_1 = require("../models/mysql/users/cron_logs");
const user_eva_1 = require("../models/mysql/eva/user_eva");
const user_eva_mutations_1 = require("../models/mysql/eva/user_eva_mutations");
const institution_eva_mutations_1 = require("../models/mysql/eva/institution_eva_mutations");
const on_hold_reduction = async (req, res) => {
    try {
        await cron_logs_1.CronLogModel.create({
            job: "on_hold_reduction",
            deleted: 0
        });
        const on_hold_reductions = await settings_1.SettingModel.findOne({
            raw: true,
            where: {
                key: { [sequelize_1.Op.eq]: 'on_hold_reduction' },
                deleted: { [sequelize_1.Op.eq]: 0 }
            }
        });
        if (!on_hold_reductions || on_hold_reductions.value.length < 1) {
            const response = response_1.ResponseData.error("Pengaturan tidak ditemukan.");
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json(response);
        }
        let job = [];
        for (const key in on_hold_reductions.value) {
            const user = await users_1.UserModel.findAll({
                raw: true,
                where: {
                    unsubscribe_days: { [sequelize_1.Op.eq]: on_hold_reductions.value[key].days },
                    deleted: { [sequelize_1.Op.eq]: 0 }
                }
            });
            if (user.length > 0) {
                for (const index in user) {
                    job.push({
                        user_id: user[index].id,
                        user_name: user[index].name,
                        reduction_percentage: on_hold_reductions.value[key].reduction
                    });
                    const trxUser = `${user[index].id}RDC`;
                    const trxTime = String(Math.round((new Date()).getTime()));
                    const trxCode = trxUser + trxTime.padStart((25 - trxUser.length), '0');
                    const eva = await user_eva_1.UserEvaModel.findOne({
                        raw: true,
                        where: {
                            user_id: { [sequelize_1.Op.eq]: user[index].id },
                            type: { [sequelize_1.Op.eq]: 'hold' },
                            deleted: { [sequelize_1.Op.eq]: 0 }
                        }
                    });
                    if (eva && +eva.balance > 0) {
                        const reduction_amount = Math.ceil(+eva.balance * on_hold_reductions.value[key].reduction / 100);
                        const user_mutation = {
                            trx_code: `${trxCode}`,
                            trx_serialization: `${trxCode}`,
                            user_id: user[index].id,
                            user_name: user[index].name,
                            type: 'hold',
                            source: 'withdraw',
                            remarks: `Reduksi saldo ditahan.`,
                            debit: reduction_amount,
                        };
                        await user_eva_mutations_1.UserEvaMutationModel.create(user_mutation);
                        const institution_mutation = {
                            trx_code: `${trxCode}`,
                            trx_serialization: `${trxCode}`,
                            institution_eva_id: 1,
                            institution_eva_code: 'tabbaru',
                            remarks: `perolehan reduksi saldo ditahan`,
                            credit: reduction_amount,
                        };
                        await institution_eva_mutations_1.InstitutionEvaMutationModel.create(institution_mutation);
                    }
                }
            }
        }
        const response = response_1.ResponseData.default;
        response.data = job;
        return res.status(http_status_codes_1.StatusCodes.OK).json(response);
    }
    catch (error) {
        console.log(error);
        const response = response_1.ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini.");
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
};
exports.on_hold_reduction = on_hold_reduction;
