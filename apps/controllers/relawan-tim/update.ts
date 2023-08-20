import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { UsersModel } from "../../models/users";
import { requestChecker } from "../../utilities/requestChecker";
import { RelawanTimAttributes, RelawanTimModel } from "../../models/relawanTim";

export const updateRelawanTim = async (req: any, res: Response) => {
	const requestBody = <RelawanTimAttributes>req.body;
	const emptyField = requestChecker({
		requireList: ["relawanTimId"],
		requestData: requestBody,
	});

	if (emptyField) {
		const message = `invalid request parameter! require (${emptyField})`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.BAD_REQUEST).json(response);
	}

	try {
		const newData = {
			...(requestBody.relawanTimName && {
				relawanTimName: requestBody.relawanTimName,
			}),
		};

		await RelawanTimModel.update(newData, {
			where: {
				deleted: { [Op.eq]: 0 },
				relawanTimId: { [Op.eq]: requestBody.relawanTimId },
			},
		});

		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = { message: "success" };
		return res.status(StatusCodes.OK).json(response);
	} catch (error: any) {
		console.log(error.message);
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};
