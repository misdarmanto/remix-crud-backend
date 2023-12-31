import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData, ResponseDataAttributes } from '../../utilities/response'
import { Op } from 'sequelize'
import { Pagination } from '../../utilities/pagination'
import { DesaModel } from '../../models/desa'
import { KecamatanModel } from '../../models/kecamatan'
import { KabupatenModel } from '../../models/kabupaten'

export const findRegion = async (req: any, res: Response) => {
  try {
    const page = new Pagination(+req.query.page || 0, +req.query.size || 10)
    const result = await DesaModel.findAndCountAll({
      where: {
        deleted: { [Op.eq]: 0 },
        ...(req.query.search && {
          [Op.or]: [{ desaName: { [Op.like]: `%${req.query.search}%` } }]
        })
      },
      attributes: ['desaName'],
      include: [
        {
          model: KecamatanModel,
          attributes: ['kecamatanName']
        },
        {
          model: KabupatenModel,
          attributes: ['kabupatenName']
        }
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
