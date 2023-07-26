import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { KecamatanModel } from "../../models/kecamatan";
import { DesaModel } from "../../models/desa";

export const findDesa = async (req: any, res: Response) => {
	try {
		const desa = await DesaModel.findAll({
			where: {
				deleted: { [Op.eq]: 0 },
			},
			attributes: [
				"desaId",
				"desaName",
				"kecamatanId",
				"kabupatenId",
				"provinceId",
			],
		});

		if (!desa) {
			const message = `data tidak ditemukan!`;
			const response = <ResponseDataAttributes>ResponseData.error(message);
			return res.status(StatusCodes.NOT_FOUND).json(response);
		}

		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = desa;
		return res.status(StatusCodes.OK).json(response);
	} catch (error: any) {
		console.log(error.message);
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};
