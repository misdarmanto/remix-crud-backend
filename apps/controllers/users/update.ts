import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { UsersAttributes, UsersModel } from "../../models/users";
import { requestChecker } from "../../utilities/requestChecker";

export const updateUser = async (req: any, res: Response) => {
	const requestBody = <UsersAttributes>req.body;
	const emptyField = requestChecker({
		requireList: ["userId"],
		requestData: requestBody,
	});

	if (emptyField) {
		const message = `invalid request parameter! require (${emptyField})`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.BAD_REQUEST).json(response);
	}

	try {
		const newData = {
			...(requestBody.userName && {
				userName: requestBody.userName,
			}),
			...(requestBody.userDetailAddress && {
				userDetailAddress: requestBody.userDetailAddress,
			}),
			...(requestBody.userDesa && {
				userDesa: requestBody.userDesa,
			}),
			...(requestBody.userKecamatan && {
				userKecamatan: requestBody.userKecamatan,
			}),
			...(requestBody.userKabupaten && {
				userKabupaten: requestBody.userKabupaten,
			}),
			...(requestBody.userPhoneNumber && {
				userPhoneNumber: requestBody.userPhoneNumber,
			}),
		};

		await UsersModel.update(newData, {
			where: {
				deleted: { [Op.eq]: 0 },
				userId: { [Op.eq]: requestBody.userId },
			},
		});

		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = { message: "success" };
		return res.status(StatusCodes.OK).json(response);
	} catch (error: any) {
		console.log(error.message);
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};
