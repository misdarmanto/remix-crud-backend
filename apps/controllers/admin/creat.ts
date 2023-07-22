import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { AdminAttributes, AdminModel } from "../../models/admins";
import { CONFIG } from "../../config";
import { requestChecker } from "../../utilities/requestChecker";
import { checkAuth } from "../../utilities/checkAuth";
import { v4 as uuidv4 } from "uuid";

export const createAdmin = async (req: any, res: Response) => {
	const requestBody = <AdminAttributes>req.body;

	const emptyField = requestChecker({
		requireList: ["x-user-id", "adminName", "adminEmail", "adminPassword"],
		requestData: { ...requestBody, ...req.headers },
	});

	if (emptyField) {
		const message = `invalid request parameter! require (${emptyField})`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.BAD_REQUEST).json(response);
	}

	try {
		const admin = checkAuth({ adminId: req.header("x-user-id") });

		if (!admin) {
			const message = `access denied!`;
			const response = <ResponseDataAttributes>ResponseData.error(message);
			return res.status(StatusCodes.UNAUTHORIZED).json(response);
		}

		const checkAdmin = await AdminModel.findOne({
			raw: true,
			where: {
				deleted: { [Op.eq]: 0 },
				adminEmail: { [Op.eq]: requestBody.adminEmail },
			},
		});

		if (checkAdmin?.adminEmail == requestBody.adminEmail) {
			const message = `Email sudah terdatar. Silahkan gunakan email lain.`;
			const response = <ResponseDataAttributes>ResponseData.error(message);
			return res.status(StatusCodes.UNAUTHORIZED).json(response);
		}

		const hashPassword = require("crypto")
			.createHash("sha1")
			.update(requestBody.adminPassword + CONFIG.secret.password_encryption)
			.digest("hex");

		requestBody.adminId = uuidv4();
		await AdminModel.create(<AdminAttributes>{
			...requestBody,
			adminPassword: hashPassword,
			deleted: 0,
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
