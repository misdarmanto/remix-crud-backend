import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { WaBlasSettingsModel } from "../../models/waBlasSettings";
import axios from "axios";
import { CONFIG } from "../../config";
import { UsersModel } from "../../models/users";

export const waBlasSendMessage = async (req: any, res: Response) => {
	try {
		const waBlasSettings = await WaBlasSettingsModel.findOne({
			where: {
				deleted: { [Op.eq]: 0 },
			},
		});

		if (!waBlasSettings) {
			const message = `wa blas settings not found!`;
			const response = <ResponseDataAttributes>ResponseData.error(message);
			return res.status(StatusCodes.NOT_FOUND).json(response);
		}

		const users = await UsersModel.findAll({
			where: {
				deleted: { [Op.eq]: 0 },
			},
		});

		for (let user of users) {
			await handleSendWhatsAppMessage({
				whatsAppNumber: user.userPhoneNumber,
				message: waBlasSettings.waBlasSettingsMessage,
			});
		}

		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = { message: "succsess" };
		return res.status(StatusCodes.OK).json(response);
	} catch (error: any) {
		console.log(error.message);
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};

type SendMessageType = {
	message: string;
	whatsAppNumber: string;
};

const handleSendWhatsAppMessage = async ({
	message,
	whatsAppNumber,
}: SendMessageType) => {
	const baseUrlPath = "https://solo.wablas.com/api/send-message?phone=";
	const apiUrl = `${baseUrlPath}${whatsAppNumber}&message=${message}&token=${CONFIG.waBlasToken}`;
	try {
		await axios.get(apiUrl);
	} catch (error: any) {
		console.log("Error:", error.message);
	}
};
