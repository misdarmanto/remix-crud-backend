import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes'
import { ResponseData, ResponseDataAttributes } from '../utilities/response'

export const index = async (req: Request, res: Response) => {
    try {
        const data = { message: "Node User Service API." }
        const response = <ResponseDataAttributes>ResponseData.default
        response.data = data
        return res.status(StatusCodes.OK).json(response)
    } catch (error) {
        console.log(error)
        const response = <ResponseDataAttributes>ResponseData.error("Tidak dapat memproses permintaan. Laporkan kendala ini.")
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response)
    }
}