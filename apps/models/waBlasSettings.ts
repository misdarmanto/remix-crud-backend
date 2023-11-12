import moment from 'moment'
import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '.'
import { ZygoteAttributes, ZygoteModel } from './zygote'

export interface WaBlasSettingsAttributes extends ZygoteAttributes {
  waBlasSettingsId: string
  waBlasSettingsMessage: string
  waBlasSettingsImage: string
}

// we're telling the Model that 'id' is optional
// when creating an instance of the model (such as using Model.create()).
type WaBlasSettingsCreationAttributes = Optional<
  WaBlasSettingsAttributes,
  'id' | 'createdOn' | 'modifiedOn'
>

// We need to declare an interface for our model that is basically what our class would be
interface ProvinceInstance
  extends Model<WaBlasSettingsAttributes, WaBlasSettingsCreationAttributes>,
    WaBlasSettingsAttributes {}

export const WaBlasSettingsModel = sequelize.define<ProvinceInstance>(
  'wa_blas_settings',
  {
    ...ZygoteModel,
    waBlasSettingsId: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    waBlasSettingsMessage: {
      type: DataTypes.STRING,
      allowNull: false
    },
    waBlasSettingsImage: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    ...sequelize,
    timestamps: false,
    tableName: 'wa_blas_settings',
    deletedAt: false,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    engine: 'InnoDB',
    hooks: {
      beforeCreate: (record, options) => {
        let now = moment().add(7, 'hours').format('YYYY-MM-DD HH:mm:ss')
        record.createdOn = now
        record.modifiedOn = null
      },
      beforeUpdate: (record, options) => {
        let now = moment().add(7, 'hours').format('YYYY-MM-DD HH:mm:ss')
        record.modifiedOn = now
      }
    }
  }
)
