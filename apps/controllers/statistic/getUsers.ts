import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData, ResponseDataAttributes } from '../../utilities/response'
import { Op } from 'sequelize'
import { UsersModel } from '../../models/users'
import { requestChecker } from '../../utilities/requestChecker'
import { Pagination } from '../../utilities/pagination'

export const getUsersStatistic = async (req: any, res: Response) => {
  const emptyField = requestChecker({
    requireList: ['desaId'],
    requestData: req.query
  })

  if (emptyField) {
    const message = `invalid request parameter! require (${emptyField})`
    const response = <ResponseDataAttributes>ResponseData.error(message)
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }

  console.log(req.query)

  try {
    const page = new Pagination(+req.query.page || 0, +req.query.size || 10)
    const result = await UsersModel.findAndCountAll({
      where: {
        deleted: { [Op.eq]: 0 },
        userDesaId: req.query.desaId,
        userKecamatanId: req.query.kecamatanId,
        userKabupatenId: req.query.kabupatenId,
        ...(req.query.search && {
          [Op.or]: [
            { userName: { [Op.like]: `%${req.query.search}%` } },
            { userPhoneNumber: { [Op.like]: `%${req.query.search}%` } }
          ]
        })
      },
      attributes: [
        'userId',
        'userName',
        'userDetailAddress',
        'userDesa',
        'userDesaId',
        'userKecamatan',
        'userKecamatanId',
        'userKabupaten',
        'userKabupatenId',
        'userPhoneNumber',
        'userPosition',
        'userReferrerName',
        'userReferrerPosition',
        'createdOn'
      ],
      order: [['id', 'desc']],
      ...(req.query.pagination == 'true' && {
        limit: page.limit,
        offset: page.offset
      })
    })

    const response = <ResponseDataAttributes>ResponseData.default
    response.data = page.data(result)
    return res.status(StatusCodes.OK).json(response)
  } catch (error: any) {
    console.log(error.message)
    const message = `unable to process request! error ${error.message}`
    const response = <ResponseDataAttributes>ResponseData.error(message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}
