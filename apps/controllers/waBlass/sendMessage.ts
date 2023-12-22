import { Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ResponseData, ResponseDataAttributes } from '../../utilities/response'
import { Op } from 'sequelize'
import { CONFIG } from '../../config'
import { WaBlasHistoryAttributes, WaBlasHistoryModel } from '../../models/waBlasHistory'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { WaBlasSettingsModel } from '../../models/waBlasSettings'

export const waBlasSendMessage = async (req: any, res: Response) => {
  try {
    const waBlasSettings = await WaBlasSettingsModel.findOne({
      where: {
        deleted: { [Op.eq]: 0 }
      }
    })

    if (!waBlasSettings) {
      const message = `pengaturan pesan default tidak ditemukan. mohon buat pengaturan pesan default terlebih dahulu!`
      const response = <ResponseDataAttributes>ResponseData.error(message)
      return res.status(StatusCodes.NOT_FOUND).json(response)
    }

    const users = JSON.parse(req.body.userData ?? '')

    for (let user of users) {
      if (user.userPhoneNumber !== null) {
        if (user.userPhoneNumber.length > 7) {
          await handleSendWhatsAppMessage({
            whatsAppNumber: user.userPhoneNumber,
            message: waBlasSettings?.waBlasSettingsMessage,
            image: waBlasSettings.waBlasSettingsImage ?? null
          })

          const payload = <WaBlasHistoryAttributes>{
            waBlasHistoryId: uuidv4(),
            waBlasHistoryUserId: user.userId,
            waBlasHistoryUserPhone: user.userPhoneNumber,
            waBlasHistoryUserName: user.userName,
            waBlasHistoryMessage: waBlasSettings.waBlasSettingsMessage
          }

          await WaBlasHistoryModel.create(payload)
        }
      }
    }

    const response = <ResponseDataAttributes>ResponseData.default
    response.data = { message: 'succsess' }
    return res.status(StatusCodes.OK).json(response)
  } catch (error: any) {
    console.log(error.message)
    const message = `unable to process request! error ${error.message}`
    const response = <ResponseDataAttributes>ResponseData.error(message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
  }
}

type SendMessageType = {
  message: string
  whatsAppNumber: string
  image?: string
}

const handleSendWhatsAppMessage = async ({
  message,
  whatsAppNumber,
  image
}: SendMessageType) => {
  const baseUrlPath = `${CONFIG.waBlasBaseUrl}/send-message?phone=`
  const apiUrl = `${baseUrlPath}${whatsAppNumber}&message=${message}&token=${CONFIG.waBlasToken}`
  try {
    if (image) {
      console.log('use image')
      await axios.post(
        `${CONFIG.waBlasBaseUrl}/api/send-image`,
        {
          phone: whatsAppNumber,
          caption: message,
          image: image
        },
        {
          headers: {
            Authorization: CONFIG.waBlasToken
          }
        }
      )
    } else {
      console.log('no image')
      await axios.get(apiUrl)
    }
  } catch (error: any) {
    console.log('Error:', error.message)
  }
}
