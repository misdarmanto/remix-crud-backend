import moment from "moment";
import { DataTypes } from "sequelize";

export const ZygoteModel = {
	id: {
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false,
	},
	createdOn: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: moment().add(7, "hours").format("YYYY-MM-DD HH:mm:ss"),
	},
	modifiedOn: {
		type: DataTypes.DATE,
		defaultValue: moment().add(7, "hours").format("YYYY-MM-DD HH:mm:ss"),
	},
	deleted: {
		type: DataTypes.TINYINT,
		allowNull: false,
		defaultValue: 0,
	},
};

export interface ZygoteAttributes {
	id: number;
	createdOn: string;
	modifiedOn: string | null;
	deleted: number;
}
