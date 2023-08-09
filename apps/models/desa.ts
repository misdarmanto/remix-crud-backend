import moment from "moment";
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import { ZygoteAttributes, ZygoteModel } from "./zygote";
import { KecamatanModel } from "./kecamatan";
import { KabupatenModel } from "./kabupaten";

export interface DesaAttributes extends ZygoteAttributes {
	desaId: string;
	desaName: string;
	kecamatanId: string;
	kabupatenId: string;
	provinceId: string;
	isRegistered: boolean;
}

// we're telling the Model that 'id' is optional
// when creating an instance of the model (such as using Model.create()).
type DesaCreationAttributes = Optional<DesaAttributes, "id" | "createdOn" | "modifiedOn">;

// We need to declare an interface for our model that is basically what our class would be
interface DesaInstance
	extends Model<DesaAttributes, DesaCreationAttributes>,
		DesaAttributes {}

export const DesaModel = sequelize.define<DesaInstance>(
	"desa",
	{
		...ZygoteModel,
		desaId: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		desaName: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		kecamatanId: {
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
		isRegistered: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: 0,
		},
	},
	{
		...sequelize,
		timestamps: false,
		tableName: "desa",
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

DesaModel.hasOne(KecamatanModel, {
	sourceKey: "kecamatanId",
	foreignKey: "kecamatanId",
});

DesaModel.hasOne(KabupatenModel, {
	sourceKey: "kabupatenId",
	foreignKey: "kabupatenId",
});
