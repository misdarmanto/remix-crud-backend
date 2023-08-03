"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.email_confirmation = exports.email_reset_password = void 0;
const mailJet = require("node-mailjet");
const config_1 = require("../../config");
const email_reset_password = async (password, destination_name, destination_email) => {
    try {
        const connection = mailJet.connect(config_1.CONFIG.secret.mailjet.mj_api_key_public, config_1.CONFIG.secret.mailjet.mj_api_key_private);
        const params = {
            Messages: [
                {
                    From: {
                        Email: "no-reply@lenterailmu.id",
                        Name: "Lentera Ilmu",
                    },
                    To: [
                        {
                            Email: destination_email,
                            Name: destination_name,
                        },
                    ],
                    Subject: "Reset Password",
                    TemplateID: 3874442,
                    Variables: {
                        full_name: destination_name.toUpperCase(),
                        password: password,
                    },
                    TemplateLanguage: true,
                },
            ],
        };
        const mailJetRequest = connection.post("send", {
            version: "v3.1",
        });
        mailJetRequest
            .request(params)
            .then((data) => {
            console.log(data);
        })
            .catch((e) => {
            console.log(e);
        });
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
exports.email_reset_password = email_reset_password;
const email_confirmation = async (confirmation_code, destination_name, destination_email) => {
    try {
        const connection = mailJet.connect(config_1.CONFIG.secret.mailjet.mj_api_key_public, config_1.CONFIG.secret.mailjet.mj_api_key_private);
        const params = {
            Messages: [
                {
                    From: {
                        Email: "no-reply@lenterailmu.id",
                        Name: "Lentera Ilmu",
                    },
                    To: [
                        {
                            Email: destination_email,
                            Name: destination_name,
                        },
                    ],
                    Subject: "Konfirmasi Email",
                    TemplateID: 3881201,
                    Variables: {
                        full_name: destination_name.toUpperCase(),
                        confirmation_code: confirmation_code,
                    },
                    TemplateLanguage: true,
                },
            ],
        };
        const mailJetRequest = connection.post("send", {
            version: "v3.1",
        });
        mailJetRequest
            .request(params)
            .then((data) => {
            console.log(data);
        })
            .catch((e) => {
            console.log(e);
        });
        // const mailJetResponse: Promise<Email.PostResponse> =
        //   mailJetRequest.request(params);
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};
exports.email_confirmation = email_confirmation;
