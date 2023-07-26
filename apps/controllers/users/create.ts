import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { UsersAttributes, UsersModel } from "../../models/users";
import { requestChecker } from "../../utilities/requestChecker";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";

export const createUser = async (req: any, res: Response) => {
	const requestBody = <UsersAttributes>req.body;
	const emptyField = requestChecker({
		requireList: [
			"userName",
			"userDetailAddress",
			"userDesa",
			"userKecamatan",
			"userKabupaten",
			"userPhoneNumber",
		],
		requestData: requestBody,
	});

	if (emptyField) {
		const message = `mohon lengkapi data berikut(${emptyField})`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.BAD_REQUEST).json(response);
	}

	try {
		requestBody.userId = uuidv4();
		await UsersModel.create(requestBody);

		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = { message: "success" };
		return res.status(StatusCodes.CREATED).json(response);
	} catch (error: any) {
		console.log(error.message);
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};