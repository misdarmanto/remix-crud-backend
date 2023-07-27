import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { UsersModel } from "../../models/users";

export const getKecamatanStatistic = async (req: any, res: Response) => {
	try {
		const listOfKecamatanRegistered = await getKecamatanRegistered(
			req.query.kabupatenId
		);
		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = listOfKecamatanRegistered;
		return res.status(StatusCodes.OK).json(response);
	} catch (error: any) {
		console.log(error.message);
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};

const getKecamatanRegistered = async (kabupatenId: string) => {
	const result: any[] = [];

	const kecamatan = await UsersModel.findAll({
		where: {
			deleted: { [Op.eq]: 0 },
			userKabupatenId: { [Op.eq]: kabupatenId },
		},
		attributes: ["userKecamatan"],
	});

	const uniqueKecamatan = [...new Set(kecamatan.map((item) => item.userKecamatan))];

	for (let i = 0; uniqueKecamatan.length > i; i++) {
		const totalDesa = await UsersModel.count({
			where: {
				deleted: { [Op.eq]: 0 },
				userKecamatanId: { [Op.eq]: uniqueKecamatan[i] },
			},
		});

		result.push({ kecamatan: uniqueKecamatan[i], totalUser: totalDesa });
	}

	return result;
};
