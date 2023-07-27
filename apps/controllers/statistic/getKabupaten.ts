import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { UsersModel } from "../../models/users";

export const getKabupatenStatistic = async (req: any, res: Response) => {
	try {
		const totalKabupatenPemalang = await getTotalKabupaten("PEMALANG");
		const totalKotaPekalongan = await getTotalKabupaten("KOTA PEKALONGAN");
		const totalKabupatenPekalongan = await getTotalKabupaten("KABUPATEN PEKALONGAN");
		const totalKabupatenBatang = await getTotalKabupaten("KABUPATEN BATANG");

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

const getTotalKabupaten = async (name: string) => {
	const result = await UsersModel.count({
		where: {
			deleted: { [Op.eq]: 0 },
			userKabupaten: { [Op.eq]: name },
		},
	});
	return result;
};
