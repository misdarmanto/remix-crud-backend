import moment from "moment";
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import { ZygoteAttributes, ZygoteModel } from "./zygote";

export interface KecamatanAttributes extends ZygoteAttributes {
	kecamatanId: string;
	kecamatanName: string;
	kabupatenId: string;
	provinceId: string;
}

// we're telling the Model that 'id' is optional
// when creating an instance of the model (such as using Model.create()).
type KecamatanCreationAttributes = Optional<
	KecamatanAttributes,
	"id" | "createdOn" | "modifiedOn"
>;

// We need to declare an interface for our model that is basically what our class would be
interface KecamatanInstance
	extends Model<KecamatanAttributes, KecamatanCreationAttributes>,
		KecamatanAttributes {}

export const KecamatanModel = sequelize.define<KecamatanInstance>(
	"kecamatan",
	{
		...ZygoteModel,
		kecamatanId: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		kecamatanName: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		kabupatenId: {
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
		tableName: "kecamatan",
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
