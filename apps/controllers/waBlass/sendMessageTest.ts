import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import axios from "axios";
import { CONFIG } from "../../config";
import { WA_BLAS_DATA, WA_BLAS_NAME } from "./data";

export const waBlasSendMessageTest = async (req: any, res: Response) => {
	try {
		for (let i = 0; WA_BLAS_DATA.length > i; i++) {
			console.log(`name: ${WA_BLAS_NAME[i]}  wa : ${WA_BLAS_DATA[i]}`);
			await handleSendWhatsAppMessage({
				whatsAppNumber: WA_BLAS_DATA[i],
				message: `halo Mas, saya Putri dari mendigitalkan.com. Apakah *${WA_BLAS_NAME[i]}* butuh dibuatkan website atau aplikasi yg lainnya? kalau boleh kami bisa bantu buatkan`,
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
	const baseUrlPath = "https://pati.wablas.com/api/send-message?phone=";
	const apiUrl = `${baseUrlPath}${whatsAppNumber}&message=${message}&token=${CONFIG.waBlasToken}`;
	try {
		await axios.get(apiUrl);
	} catch (error: any) {
		console.log("Error:", error.message);
	}
};
