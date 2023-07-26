import moment from "moment";
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import { ZygoteAttributes, ZygoteModel } from "./zygote";

export interface KabupatenAttributes extends ZygoteAttributes {
	kabupatenId: string;
	kabupatenName: string;
	provinceId: string;
}

// we're telling the Model that 'id' is optional
// when creating an instance of the model (such as using Model.create()).
type KabupatenCreationAttributes = Optional<
	KabupatenAttributes,
	"id" | "createdOn" | "modifiedOn"
>;

// We need to declare an interface for our model that is basically what our class would be
interface KabupatenInstance
	extends Model<KabupatenAttributes, KabupatenCreationAttributes>,
		KabupatenAttributes {}

export const KabupatenModel = sequelize.define<KabupatenInstance>(
	"kabupaten",
	{
		...ZygoteModel,
		kabupatenId: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		kabupatenName: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		provinceId: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
	},
	{
		...sequelize,
		timestamps: false,
		tableName: "kabupaten",
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
