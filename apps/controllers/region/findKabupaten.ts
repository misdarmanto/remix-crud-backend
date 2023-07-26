import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { KabupatenModel } from "../../models/kabupaten";

export const findKabupaten = async (req: any, res: Response) => {
	try {
		const kabupaten = await KabupatenModel.findAll({
			where: {
				deleted: { [Op.eq]: 0 },
			},
			attributes: ["kabupatenId", "kabupatenName", "provinceId"],
		});

		if (!kabupaten) {
			const message = `data tidak ditemukan!`;
			const response = <ResponseDataAttributes>ResponseData.error(message);
			return res.status(StatusCodes.NOT_FOUND).json(response);
		}

		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = kabupaten;
		return res.status(StatusCodes.OK).json(response);
	} catch (error: any) {
		console.log(error.message);
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};
