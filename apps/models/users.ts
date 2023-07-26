import moment from "moment";
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import { ZygoteAttributes, ZygoteModel } from "./zygote";

export interface UsersAttributes extends ZygoteAttributes {
	userId: string;
	userName: string;
	userDetailAddress: string;
	userDesa: string;
	userKecamatan: string;
	userKabupaten: string;
	userPhoneNumber: string;
}

// we're telling the Model that 'id' is optional
// when creating an instance of the model (such as using Model.create()).
type UsersCreationAttributes = Optional<
	UsersAttributes,
	"id" | "createdOn" | "modifiedOn"
>;

// We need to declare an interface for our model that is basically what our class would be
interface UsersInstance
	extends Model<UsersAttributes, UsersCreationAttributes>,
		UsersAttributes {}

export const UsersModel = sequelize.define<UsersInstance>(
	"users",
	{
		...ZygoteModel,
		userId: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		userName: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		userDetailAddress: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		userDesa: {
			type: DataTypes.STRING(200),
			allowNull: false,
		},
		userKecamatan: {
			type: DataTypes.STRING(200),
			allowNull: false,
		},
		userKabupaten: {
			type: DataTypes.STRING(200),
			allowNull: false,
		},
		userPhoneNumber: {
			type: DataTypes.STRING(200),
			allowNull: false,
		},
	},
	{
		...sequelize,
		timestamps: false,
		tableName: "users",
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