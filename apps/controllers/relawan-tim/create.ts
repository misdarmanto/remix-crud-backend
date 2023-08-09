import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { requestChecker } from "../../utilities/requestChecker";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { RelawanTimAttributes, RelawanTimModel } from "../../models/relawanTim";
import { Op } from "sequelize";

export const createRelawanTim = async (req: any, res: Response) => {
	const requestBody = <RelawanTimAttributes>req.body;
	const emptyField = requestChecker({
		requireList: ["relawanTimName"],
		requestData: requestBody,
	});

	if (emptyField) {
		const message = `mohon lengkapi data berikut(${emptyField})`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.BAD_REQUEST).json(response);
	}

	try {
		const checkRelawanTim = await RelawanTimModel.findOne({
			where: {
				deleted: { [Op.eq]: 0 },
				relawanTimName: { [Op.eq]: requestBody.relawanTimName },
			},
		});

		if (checkRelawanTim) {
			const message = `nama sudah digunakan, gunakan nama lain`;
			const response = <ResponseDataAttributes>ResponseData.error(message);
			return res.status(StatusCodes.BAD_REQUEST).json(response);
		}

		requestBody.relawanTimId = uuidv4();
		await RelawanTimModel.create(requestBody);

		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = { message: "success" };
		return res.status(StatusCodes.CREATED).json(response);
	} catch (error: any) {
		console.log(error.message);
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};
