import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { UsersModel } from "../../models/users";
import { requestChecker } from "../../utilities/requestChecker";

export const getDesaStatistic = async (req: any, res: Response) => {
	const emptyField = requestChecker({
		requireList: ["kabupatenId", "kecamatanId"],
		requestData: req.query,
	});

	if (emptyField) {
		const message = `invalid request parameter! require (${emptyField})`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.BAD_REQUEST).json(response);
	}

	try {
		const listOfDesaRegistered = await getDesaRegistered({
			kabupatenId: req.query.kabupatenId,
			kecamatanId: req.query.kecamatanId,
		});
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

type GetDesaTypes = {
	kecamatanId: string;
	kabupatenId: string;
};

const getDesaRegistered = async ({ kecamatanId, kabupatenId }: GetDesaTypes) => {
	const result: any[] = [];

	const findUsers = await UsersModel.findAll({
		where: {
			deleted: { [Op.eq]: 0 },
			userKecamatanId: { [Op.eq]: kecamatanId },
			userKabupatenId: { [Op.eq]: kabupatenId },
		},
	});

	const uniqueDesaId = [...new Set(findUsers.map((item) => item.userDesaId))];

	for (let i = 0; uniqueDesaId.length > i; i++) {
		const totalDesa = await UsersModel.count({
			where: {
				deleted: { [Op.eq]: 0 },
				userDesaId: { [Op.eq]: uniqueDesaId[i] },
				userKecamatanId: { [Op.eq]: kecamatanId },
				userKabupatenId: { [Op.eq]: kabupatenId },
			},
		});

		const findUserWithDesaId = findUsers.find(
			(item) => item.userDesaId === uniqueDesaId[i]
		);

		result.push({
			desa: findUserWithDesaId?.userDesa,
			desaId: findUserWithDesaId?.userDesaId,
			kecamatanId: findUserWithDesaId?.userKabupatenId,
			kabupatenId: findUserWithDesaId?.userKabupatenId,
			totalUser: totalDesa,
		});
	}

	return result;
};
