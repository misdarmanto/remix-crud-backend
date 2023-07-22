import { Op } from "sequelize";
import { AdminModel } from "../models/admins";

export const checkAuth = async ({ adminId }: { adminId: string }) => {
	try {
		const checkAdmin = await AdminModel.findOne({
			raw: true,
			where: {
				deleted: { [Op.eq]: 0 },
				adminId: { [Op.eq]: adminId },
			},
		});
		return checkAdmin;
	} catch (error: any) {
		throw error;
	}
};
