import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData, ResponseDataAttributes } from '../../utilities/response'
import { DesaAttributes, DesaModel } from '../../models/desa'
import { requestChecker } from '../../utilities/requestChecker'

export const createRegion = async (req: any, res: Response) => {
  const requestBody = req.body as DesaAttributes

  const emptyField = requestChecker({
    requireList: ['desaName', 'desaId', 'kecamatanId', 'kabupatenId', 'provinceId'],
    requestData: requestBody
  })

  if (emptyField) {
    const message = `mohon lengkapi data berikut(${emptyField})`
    const response = <ResponseDataAttributes>ResponseData.error(message)
    return res.status(StatusCodes.BAD_REQUEST).json(response)
  }
  try {
    // const newData = <DesaAttributes[]>desaList.map((item, index) => {
    //   return {
    //     desaName: item.name,
    //     desaId: `11415${index + 1}`,
    //     kecamatanId: `11415`,
    //     kabupatenId: '14',
    //     provinceId: '1'
    //   }
    // })

    await DesaModel.create(requestBody)

    const response = <ResponseDataAttributes>ResponseData.default
    response.data = { message: 'success' }
    return res.status(StatusCodes.CREATED).json(response)
  } catch (error: any) {
    console.log(error.message)
    const message = `unable to process request! error ${error.message}`
    const response = <ResponseDataAttributes>ResponseData.error(message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}
