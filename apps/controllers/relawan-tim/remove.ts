import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { requestChecker } from "../../utilities/requestChecker";
import { RelawanTimAttributes, RelawanTimModel } from "../../models/relawanTim";

export const removeRelawanTim = async (req: any, res: Response) => {
	const requestQuery = <RelawanTimAttributes>req.query;
	const emptyField = requestChecker({
		requireList: ["relawanTimId"],
		requestData: requestQuery,
	});

	if (emptyField) {
		const message = `invalid request parameter! require (${emptyField})`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.BAD_REQUEST).json(response);
	}

	try {
		const user = await RelawanTimModel.findOne({
			where: {
				deleted: { [Op.eq]: 0 },
				relawanTimId: { [Op.eq]: requestQuery.relawanTimId },
			},
		});

		if (!user) {
			const message = `data tidak ditemukan!`;
			const response = <ResponseDataAttributes>ResponseData.error(message);
			return res.status(StatusCodes.NOT_FOUND).json(response);
		}

		await RelawanTimModel.update(
			{ deleted: 1 },
			{
				where: {
					relawanTimId: { [Op.eq]: requestQuery.relawanTimId },
				},
			}
		);

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
