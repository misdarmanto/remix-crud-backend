import moment from "moment";
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import { ZygoteAttributes, ZygoteModel } from "./zygote";

export interface WaBlasHistoryAttributes extends ZygoteAttributes {
	waBlasHistoryId: string;
	waBlasHistoryUserId: string;
	waBlasHistoryUserName: string;
	waBlasHistoryUserPhone: string;
	waBlasHistoryMessage: string;
}

// we're telling the Model that 'id' is optional
// when creating an instance of the model (such as using Model.create()).
type WaBlasHistoryCreationAttributes = Optional<
	WaBlasHistoryAttributes,
	"id" | "createdOn" | "modifiedOn"
>;

// We need to declare an interface for our model that is basically what our class would be
interface WaBlasHistoryInstance
	extends Model<WaBlasHistoryAttributes, WaBlasHistoryCreationAttributes>,
		WaBlasHistoryAttributes {}

export const WaBlasSettingsModel = sequelize.define<WaBlasHistoryInstance>(
	"wa_blas_history",
	{
		...ZygoteModel,
		waBlasHistoryId: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		waBlasHistoryUserId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		waBlasHistoryUserName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		waBlasHistoryUserPhone: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		waBlasHistoryMessage: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		...sequelize,
		timestamps: false,
		tableName: "wa_blas_history",
		deletedAt: false,
		paranoid: true,
		underscored: true,
		freezeTableName: true,
		engine: "InnoDB",
		hooks: {
			beforeCreate: (record, options) => {
				let now = moment().add(7, "hours").format("YYYY-MM-DD HH:mm:ss");
				record.createdOn = now;
				record.modifiedOn = null;
			},
			beforeUpdate: (record, options) => {
				let now = moment().add(7, "hours").format("YYYY-MM-DD HH:mm:ss");
				record.modifiedOn = now;
			},
		},
	}
);
