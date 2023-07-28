import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { UsersModel } from "../../models/users";
import { requestChecker } from "../../utilities/requestChecker";

export const getKecamatanStatistic = async (req: any, res: Response) => {
	const emptyField = requestChecker({
		requireList: ["kabupatenId"],
		requestData: req.query,
	});

	if (emptyField) {
		const message = `invalid request parameter! require (${emptyField})`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.BAD_REQUEST).json(response);
	}

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

	const findAllUsersWithKabupatenId = await UsersModel.findAll({
		where: {
			deleted: { [Op.eq]: 0 },
			userKabupatenId: { [Op.eq]: kabupatenId },
		},
	});

	const uniqueKecamatanId = [
		...new Set(findAllUsersWithKabupatenId.map((item) => item.userKecamatanId)),
	];

	for (let i = 0; uniqueKecamatanId.length > i; i++) {
		const totalDesa = await UsersModel.count({
			where: {
				deleted: { [Op.eq]: 0 },
				userKecamatanId: { [Op.eq]: uniqueKecamatanId[i] },
			},
		});

		const findData = findAllUsersWithKabupatenId.find(
			(item) => item.userKecamatanId === uniqueKecamatanId[i]
		);

		result.push({
			kecamatan: findData?.userKecamatan,
			kecamatanId: findData?.userKecamatanId,
			kabupatenId: findData?.userKabupatenId,
			totalUser: totalDesa,
		});
	}

	return result;
};
