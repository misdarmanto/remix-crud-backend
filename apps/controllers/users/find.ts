import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { Pagination } from "../../utilities/pagination";
import { requestChecker } from "../../utilities/requestChecker";
import { UsersModel } from "../../models/users";

export const findAllUsers = async (req: any, res: Response) => {
	try {
		const page = new Pagination(+req.query.page || 0, +req.query.size || 10);
		const result = await UsersModel.findAndCountAll({
			where: {
				deleted: { [Op.eq]: 0 },
				...(req.query.search && {
					[Op.or]: [
						{ userName: { [Op.like]: `%${req.query.search}%` } },
						{ userPhoneNumber: { [Op.like]: `%${req.query.search}%` } },
						{ userDesa: { [Op.like]: `%${req.query.search}%` } },
						{ userKecamatan: { [Op.like]: `%${req.query.search}%` } },
						{ userKabupaten: { [Op.like]: `%${req.query.search}%` } },
						{ userRelawanName: { [Op.like]: `%${req.query.search}%` } },
						{ userRelawanTimName: { [Op.like]: `%${req.query.search}%` } },
					],
				}),
			},
			attributes: [
				"userId",
				"userName",
				"userDetailAddress",
				"userDesa",
				"userDesaId",
				"userKecamatan",
				"userKecamatanId",
				"userKabupaten",
				"userKabupatenId",
				"userPhoneNumber",
				"userRelawanTimName",
				"userRelawanName",
				"createdOn",
			],
			order: [["id", "desc"]],
			...(req.query.pagination == "true" && {
				limit: page.limit,
				offset: page.offset,
			}),
		});

		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = page.data(result);
		return res.status(StatusCodes.OK).json(response);
	} catch (error: any) {
		console.log(error.message);
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};

export const findOneUser = async (req: any, res: Response) => {
	const emptyField = requestChecker({
		requireList: ["userId"],
		requestData: req.params,
	});

	if (emptyField) {
		const message = `invalid request parameter! require (${emptyField})`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.BAD_REQUEST).json(response);
	}

	try {
		const user = await UsersModel.findOne({
			where: {
				deleted: { [Op.eq]: 0 },
				userId: { [Op.eq]: req.params.userId },
			},
			attributes: [
				"userId",
				"userName",
				"userDetailAddress",
				"userDesa",
				"userDesaId",
				"userKecamatan",
				"userKecamatanId",
				"userKabupaten",
				"userKabupatenId",
				"userPhoneNumber",
				"userRelawanTimName",
				"userRelawanName",
				"createdOn",
			],
		});

		if (!user) {
			const message = `user not found!`;
			const response = <ResponseDataAttributes>ResponseData.error(message);
			return res.status(StatusCodes.NOT_FOUND).json(response);
		}

		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = user;
		return res.status(StatusCodes.OK).json(response);
	} catch (error: any) {
		console.log(error.message);
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};
