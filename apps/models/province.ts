import moment from "moment";
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import { ZygoteAttributes, ZygoteModel } from "./zygote";

export interface ProvinceAttributes extends ZygoteAttributes {
	provinceId: string;
	provinceName: string;
}

// we're telling the Model that 'id' is optional
// when creating an instance of the model (such as using Model.create()).
type ProvinceCreationAttributes = Optional<
	ProvinceAttributes,
	"id" | "createdOn" | "modifiedOn"
>;

// We need to declare an interface for our model that is basically what our class would be
interface ProvinceInstance
	extends Model<ProvinceAttributes, ProvinceCreationAttributes>,
		ProvinceAttributes {}

export const ProvinceModel = sequelize.define<ProvinceInstance>(
	"province",
	{
		...ZygoteModel,
		provinceId: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		provinceName: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
	},
	{
		...sequelize,
		timestamps: false,
		tableName: "province",
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
