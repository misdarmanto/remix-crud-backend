import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { UsersModel } from "../../models/users";

export const getDesaStatistic = async (req: any, res: Response) => {
	try {
		const listOfDesaRegistered = await getDesaRegistered(
			req.query.kecamatanName.toUpperCase().trim()
		);
		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = listOfDesaRegistered;
		return res.status(StatusCodes.OK).json(response);
	} catch (error: any) {
		console.log(error.message);
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};

const getDesaRegistered = async (name: string) => {
	const result: any[] = [];

	const desa = await UsersModel.findAll({
		where: {
			deleted: { [Op.eq]: 0 },
			userKecamatan: { [Op.eq]: name },
		},
		attributes: ["userDesa"],
	});

	const uniqueDesa = [...new Set(desa.map((item) => item.userDesa))];

	for (let i = 0; uniqueDesa.length > i; i++) {
		const totalDesa = await UsersModel.count({
			where: {
				deleted: { [Op.eq]: 0 },
				userDesa: { [Op.eq]: uniqueDesa[i] },
			},
		});

		result.push({ desa: uniqueDesa[i], totalUser: totalDesa });
	}

	return result;
};
