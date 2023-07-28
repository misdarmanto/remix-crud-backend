import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { UsersModel } from "../../models/users";
import { KabupatenModel } from "../../models/kabupaten";

export const getKabupatenStatistic = async (req: any, res: Response) => {
	try {
		const totalKabupaten = await getTotalKabupaten();
		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = totalKabupaten;
		return res.status(StatusCodes.OK).json(response);
	} catch (error: any) {
		console.log(error.message);
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};

const getTotalKabupaten = async () => {
	const result: any[] = [];

	const kabupaten = await KabupatenModel.findAll({
		where: {
			deleted: { [Op.eq]: 0 },
			provinceId: { [Op.eq]: 1 },
		},
	});

	for (let i = 0; kabupaten.length > i; i++) {
		const totalUsers = await UsersModel.count({
			where: {
				deleted: { [Op.eq]: 0 },
				userKabupatenId: { [Op.eq]: kabupaten[i].kabupatenId },
			},
		});

		result.push({
			kabupatenName: kabupaten[i].kabupatenName,
			kabupatenId: kabupaten[i].kabupatenId,
			totalUser: totalUsers,
		});
	}
	return result;
};
