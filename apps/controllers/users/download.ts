import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData, ResponseDataAttributes } from '../../utilities/response'
import { Op } from 'sequelize'
import { Pagination } from '../../utilities/pagination'
import { UsersModel } from '../../models/users'

export const downloadUser = async (req: any, res: Response) => {
  try {
    const result = await UsersModel.findAndCountAll({
      where: {
        deleted: { [Op.eq]: 0 },
        ...(req.query.search && {
          [Op.or]: [
            { userName: { [Op.like]: `%${req.query.search}%` } },
            { userPhoneNumber: { [Op.like]: `%${req.query.search}%` } },
            { userDesa: { [Op.like]: `%${req.query.search}%` } },
            { userKecamatan: { [Op.like]: `%${req.query.search}%` } },
            { userKabupaten: { [Op.like]: `%${req.query.search}%` } },
            { userPosition: { [Op.like]: `%${req.query.search}%` } }
          ]
        }),
        ...(req.query.searchUserReferrer && {
          userPosition: { [Op.eq]: `${req.query.searchUserReferrer}` }
        }),
        ...(req.query.userKabupaten && {
          userKabupaten: { [Op.eq]: req.query.userKabupaten }
        }),
        ...(req.query.userKecamatan && {
          userKecamatan: { [Op.eq]: req.query.userKecamatan }
        }),
        ...(req.query.userDesa && {
          userDesa: { [Op.eq]: req.query.userDesa }
        }),
        ...(req.query.userPosition && {
          userPosition: { [Op.eq]: req.query.userPosition }
        }),
        ...(req.query.userName && {
          userName: { [Op.eq]: req.query.userName }
        })
      },
      order: [['id', 'desc']]
    })
    const response = <ResponseDataAttributes>ResponseData.default
    response.data = result
    return res.status(StatusCodes.OK).json(response)
  } catch (error: any) {
    console.log(error.message)
    const message = `unable to process request! error ${error.message}`
    const response = <ResponseDataAttributes>ResponseData.error(message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}
