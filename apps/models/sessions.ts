import moment from "moment";
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import { ZygoteAttributes, ZygoteModel } from "./zygote";

export interface SessionAttributes extends ZygoteAttributes {
	sessionId: string;
	sessionAdminId: string;
	session: string;
	sessionExpiredOn: number;
}

// we're telling the Model that 'id' is optional
// when creating an instance of the model (such as using Model.create()).
type SessionCreationAttributes = Optional<
	SessionAttributes,
	"id" | "createdOn" | "modifiedOn"
>;

// We need to declare an interface for our model that is basically what our class would be
interface SessionInstance
	extends Model<SessionAttributes, SessionCreationAttributes>,
		SessionAttributes {}

export const SessionModel = sequelize.define<SessionInstance>(
	"sessions",
	{
		...ZygoteModel,
		sessionId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		sessionAdminId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		session: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		sessionExpiredOn: {
			type: DataTypes.BIGINT,
			allowNull: true,
		},
	},
	{
		...sequelize,
		timestamps: false,
		tableName: "sessions",
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
