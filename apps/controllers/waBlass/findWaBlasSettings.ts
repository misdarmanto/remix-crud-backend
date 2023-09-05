import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { WaBlasSettingsModel } from "../../models/waBlasSettings";

export const findWaBlasSettings = async (req: any, res: Response) => {
	try {
		const waBlasSettings = await WaBlasSettingsModel.findOne({
			where: {
				deleted: { [Op.eq]: 0 },
			},
		});

		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = waBlasSettings;
		return res.status(StatusCodes.OK).json(response);
	} catch (error: any) {
		console.log(error.message);
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};
