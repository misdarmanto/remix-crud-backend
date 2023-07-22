import moment from "moment";
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import { ZygoteAttributes, ZygoteModel } from "./zygote";

export interface AdminAttributes extends ZygoteAttributes {
	adminId: string;
	adminName: string;
	adminEmail: string;
	adminPassword: string;
}

// we're telling the Model that 'id' is optional
// when creating an instance of the model (such as using Model.create()).
type AdminCreationAttributes = Optional<
	AdminAttributes,
	"id" | "createdOn" | "modifiedOn"
>;

// We need to declare an interface for our model that is basically what our class would be
interface AdminInstance
	extends Model<AdminAttributes, AdminCreationAttributes>,
		AdminAttributes {}

export const AdminModel = sequelize.define<AdminInstance>(
	"admins",
	{
		...ZygoteModel,
		adminId: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		adminName: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		adminEmail: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		adminPassword: {
			type: DataTypes.STRING(200),
			allowNull: false,
		},
	},
	{
		...sequelize,
		timestamps: false,
		tableName: "admins",
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
