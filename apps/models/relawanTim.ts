import moment from "moment";
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import { ZygoteAttributes, ZygoteModel } from "./zygote";

export interface RelawanTimAttributes extends ZygoteAttributes {
	relawanTimId: string;
	relawanTimName: string;
}

// we're telling the Model that 'id' is optional
// when creating an instance of the model (such as using Model.create()).
type RelawanTimCreationAttributes = Optional<
	RelawanTimAttributes,
	"id" | "createdOn" | "modifiedOn"
>;

// We need to declare an interface for our model that is basically what our class would be
interface RelawanTimInstance
	extends Model<RelawanTimAttributes, RelawanTimCreationAttributes>,
		RelawanTimAttributes {}

export const RelawanTimModel = sequelize.define<RelawanTimInstance>(
	"relawan_tim",
	{
		...ZygoteModel,
		relawanTimId: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		relawanTimName: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
	},
	{
		...sequelize,
		timestamps: false,
		tableName: "relawan_tim",
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
