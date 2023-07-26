import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { KabupatenModel } from "../../models/kabupaten";
import { UsersModel } from "../../models/users";

export const statistic = async (req: any, res: Response) => {
	try {
		const totalKabupatenPemalang = await UsersModel.count({
			where: {
				deleted: { [Op.eq]: 0 },
				userKabupaten: { [Op.eq]: "PEMALANG" },
			},
		});

		const totalKotaPekalongan = await UsersModel.count({
			where: {
				deleted: { [Op.eq]: 0 },
				userKabupaten: { [Op.eq]: "KOTA PEKALONGAN" },
			},
		});

		const totalKabupatenPekalongan = await UsersModel.count({
			where: {
				deleted: { [Op.eq]: 0 },
				userKabupaten: { [Op.eq]: "KABUPATEN PEKALONGAN" },
			},
		});

		const totalKabupatenBatang = await UsersModel.count({
			where: {
				deleted: { [Op.eq]: 0 },
				userKabupaten: { [Op.eq]: "KABUPATEN BATANG" },
			},
		});

		const response = <ResponseDataAttributes>ResponseData.default;

		response.data = {
			totalKotaPekalongan,
			totalKabupatenPemalang,
			totalKabupatenPekalongan,
			totalKabupatenBatang,
		};
		return res.status(StatusCodes.OK).json(response);
	} catch (error: any) {
		console.log(error.message);
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};
