import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { Pagination } from "../../utilities/pagination";
import { requestChecker } from "../../utilities/requestChecker";
import { WaBlasHistoryModel } from "../../models/waBlasHistory";

export const waBlasHistoryFindAll = async (req: any, res: Response) => {
	try {
		const page = new Pagination(+req.query.page || 0, +req.query.size || 10);
		const result = await WaBlasHistoryModel.findAndCountAll({
			where: {
				deleted: { [Op.eq]: 0 },
				...(req.query.search && {
					[Op.or]: [
						{ waBlasHistoryUserName: { [Op.like]: `%${req.query.search}%` } },
						{
							waBlasHistoryUserPhone: {
								[Op.like]: `%${req.query.search}%`,
							},
						},
					],
				}),
			},
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

export const waBlasHistoryFindOne = async (req: any, res: Response) => {
	const emptyField = requestChecker({
		requireList: ["waBlasHistoryId"],
		requestData: req.params,
	});

	if (emptyField) {
		const message = `invalid request parameter! require (${emptyField})`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.BAD_REQUEST).json(response);
	}

	try {
		const waBlasHistory = await WaBlasHistoryModel.findOne({
			where: {
				deleted: { [Op.eq]: 0 },
				waBlasHistoryId: { [Op.eq]: req.params.waBlasHistoryId },
			},
		});

		if (!waBlasHistory) {
			const message = `not found!`;
			const response = <ResponseDataAttributes>ResponseData.error(message);
			return res.status(StatusCodes.NOT_FOUND).json(response);
		}

		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = waBlasHistory;
		return res.status(StatusCodes.OK).json(response);
	} catch (error: any) {
		console.log(error.message);
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};
