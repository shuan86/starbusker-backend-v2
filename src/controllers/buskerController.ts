import { Request, response, Response } from 'express';
import { Busker, GetBuskerType, ConfirmLinePayOrderType } from "../entities/Busker";
import { BuskerPerformance, GetPerformancesType, GetPerformanceType } from "../entities/BuskerPerformance";
import * as  buskerRepo from '../repositories/buskerRepo';
import { plainToClass, Expose } from "class-transformer";
import { validate } from "class-validator";
import { setDate } from '../moudles/time';
import { confirmLineDonateOrder } from "../moudles/linePay";
import { decrypt } from "../moudles/rsa";
import { envSetup } from "../envSetup";
import * as dotenv from 'dotenv'
dotenv.config({ path: envSetup() })

export const getBusker = async (req: Request, res: Response) => {
    try {
        const data = req.query.data as string
        const buskerId = plainToClass(GetBuskerType, JSON.parse(data))
        const errors = await validate(buskerId, { skipMissingProperties: true })
        if (errors.length > 0) {
            // console.error(errors);
            res.status(400).send(`parameter error`);
            return;
        } else {
            const result = await buskerRepo.getBuskerInfoByBuskerId(buskerId.id)
            if (result.status == 200 || result.status == 401) {
                res.status(result.status).send(result.data)
            }
            else {
                res.status(500).send('server is busying')
            }
        }
    } catch (error) {
        console.error('api getBusker  error:', error);
    }
}

export const enroll = async (req: Request, res: Response) => {
    try {
        const data = req.body.data
        const busker = plainToClass(Busker, JSON.parse(data))
        const errors = await validate(busker, { skipMissingProperties: true })
        if (errors.length > 0) {
            // console.error(errors);
            res.status(400).send(`parameter error`);
            return;
        } else {
            const memberId = req.user as number
            busker.memberId = memberId
            const result = await buskerRepo.enroll(busker)
            console.log('busker enroll:', result);
            if (result.status == 200 || result.status == 401) {
                res.status(result.status).send(result.data)
            }
            else {
                res.status(500).send('server is busying')
            }
        }
    } catch (error) {
        console.error('api enroll error:', error);
    }
}

export const getPerformances = async (req: Request, res: Response) => {
    try {
        const data = req.query.data as string
        const performance = plainToClass(GetPerformancesType, JSON.parse(data))
        const errors = await validate(performance)
        if (errors.length > 0) {
            // console.error(errors);
            res.status(400).send(`parameter error`);
            return;
        } else {
            // if (performance.time.includes('-') == false) {

            // }
            const timeArr = performance.time.split('-')

            if (timeArr.length < 3) {
                res.status(400).send(`time parameter error`);
                return;
            }
            const year = Number(timeArr[0])
            const month = Number(timeArr[1])
            const date = Number(timeArr[2])
            if (year == NaN || month == NaN || date == NaN) {
                res.status(400).send(`time parameter error`);
                return;
            }
            const result = await buskerRepo.getPerformances(setDate(year, month, date), performance.page)
            if (result.status == 200 || result.status == 401) {
                res.status(result.status).send(result.data)
            }
            else {
                res.status(500).send('server is busying')
            }
        }
    } catch (error) {
        console.error('api getPerformances error:', error);
    }
}
export const getPerformance = async (req: Request, res: Response) => {
    try {
        const data = req.query.data as string
        const performance = plainToClass(GetPerformanceType, JSON.parse(data))
        const errors = await validate(performance, { skipMissingProperties: true })
        if (errors.length > 0) {
            // console.error(errors);
            res.status(400).send(`parameter error`);
            return;
        } else {
            const result = await buskerRepo.getPerformanceInfo(performance.performanceId)
            if (result.status == 200 || result.status == 401) {
                res.status(result.status).send(result.data)
            }
            else {
                res.status(500).send('server is busying')
            }
        }
    } catch (error) {
        console.error('api getBusker  error:', error);
    }
}

export const applyPerformance = async (req: Request, res: Response) => {
    try {
        const data = req.body.data
        const performance = plainToClass(BuskerPerformance, JSON.parse(data))
        const errors = await validate(performance, { skipMissingProperties: true })
        if (errors.length > 0) {
            console.log('applyPerformance error:', errors);

            res.status(400).send(`parameter error`);
            return;
        } else {
            const memberId = req.user as number
            const buskerId = await buskerRepo.getIdByMemberId(memberId)
            performance.buskerId = buskerId
            if (buskerId) {
                const result = await buskerRepo.applyPerformance(memberId, performance)
                res.status(result.status).send(result.data)
            }
            else
                res.status(501).send('server is busying')
        }
    } catch (error) {
        console.error('api applyPerformance error:', error);
    }
}



export const getAllPerformanceTime = async (req: Request, res: Response) => {
    try {
        const result = await buskerRepo.getAllPerformanceTime()
        if (result.status == 200 || result.status == 401) {
            res.status(result.status).send(result.data)
        }
        else {
            res.status(500).send('server is busying')
        }

    } catch (error) {
        console.error('api getAllPerformanceTime error:', error);
    }
}
export const deletePerformance = async (req: Request, res: Response) => {
    try {
        const data = req.body.data as string

        const performance = plainToClass(GetPerformanceType, JSON.parse(data))
        const errors = await validate(performance)
        if (errors.length > 0) {
            // console.error(errors);
            res.status(400).send(`parameter error`);
            return;
        } else {
            const result = await buskerRepo.deletePerformance(performance.performanceId)
            res.status(result.status).send(result.data)
        }
    } catch (error) {
        console.error('api deletePerformance error:', error);
    }
}
export const getOnlineAmount = async (req: Request, res: Response) => {
    try {
        const memberId = req.user as number
        const buskerId = await buskerRepo.getIdByMemberId(memberId)
        if (buskerId) {
            const result = await buskerRepo.getTop5NewestHighestOnlineAmount(buskerId)
            res.status(result.status).send(result.data)
        } else {
            res.status(401).send(`failed to get data`);
            return;
        }
    } catch (error) {
        console.error('api getOnlineAmount error:', error);
    }
}
export const getCommentAmount = async (req: Request, res: Response) => {
    try {
        const memberId = req.user as number
        const buskerId = await buskerRepo.getIdByMemberId(memberId)
        if (buskerId) {
            const result = await buskerRepo.getTop5HighestCommentAmount(buskerId)
            res.status(result.status).send(result.data)
        } else {
            res.status(401).send(`failed to get data`);
            return;
        }
    } catch (error) {
        console.error('api getOnlineAmount error:', error);
    }
}
export const getPerformancesDonate = async (req: Request, res: Response) => {
    try {
        const memberId = req.user as number

        if (memberId) {
            const result = await buskerRepo.getPerformancesDonateByMemberId(memberId)
            res.status(result.status).send(result.data)
        } else {
            res.status(401).send(`failed to get data`);
            return;
        }
    } catch (error) {
        console.error('api getPerformancesDonate error:', error);
    }
}
export const getWeekCommentAmount = async (req: Request, res: Response) => {
    const memberId = req.user as number
    const buskerId = await buskerRepo.getIdByMemberId(memberId)
    if (buskerId) {
        const result = await buskerRepo.getWeekCommentAmount(buskerId)
        res.status(result.status).send(result.data)
    } else {
        res.status(401).send(`failed to get data`);
        return;
    }
}
export const getFuturePerformancesData = async (req: Request, res: Response) => {
    const memberId = req.user as number
    const buskerId = await buskerRepo.getIdByMemberId(memberId)
    if (buskerId) {
        const result = await buskerRepo.getFuturePerformancesData(buskerId)
        res.status(result.status).send(result.data)
    } else {
        res.status(401).send(`failed to get data`);
        return;
    }
}
export const confirmLinePayDonateOrder = async (req: Request, res: Response) => {
    try {
        const { transactionId, orderId } = req.query
        const lienData = await confirmLineDonateOrder(transactionId as string)
        const orderIdStr = orderId as string
        if (lienData.returnCode == '0000') {
            const donateAmount = lienData.info.payInfo[0].amount
            const findData = await buskerRepo.getNameBukserIdPerformanceIdByLinePayOrderId(orderId as string)
            if (findData != null) {
                const updateResult = await buskerRepo.updateLinePayMoneyByPerformanceId(findData.performanceId
                    , donateAmount)
                if (updateResult) {
                    res.redirect(`${process.env.CLIENT_URL}/donateResult?name=${findData.name}&performanceId=${findData.performanceId}&donateResult=true&donateAmount=${donateAmount}`)
                    return
                }
            }
        }
        res.redirect(`${process.env.CLIENT_URL}/donateResult?performanceId=${orderIdStr.split('&')[2]}&donateResult=false`)
    } catch (error) {
        console.error('api confirmLinePayOrder error:', error);
    }
}
// export class BuskerController {
//     /**
//      * async name
//      */
//     public async enroll(req: Request, res: Response) {
//         try {
//             const encryptData = req.body.encryptData
//             const data = decrypt(encryptData)
//             const busker = plainToClass(Busker, JSON.parse(data))
//             const errors = await validate(busker, { skipMissingProperties: true })
//             if (errors.length > 0) {
//                 // console.error(errors);
//                 res.status(400).send(`parameter error`);
//                 return;
//             } else {
//                 const result = await buskerRepo.enroll(busker)
//                 if (result.status == 200 || result.status == 401) {
//                     res.status(result.status).send(result.data)
//                 }
//                 else {
//                     res.status(500).send('server is busying')
//                 }
//             }
//         } catch (error) {
//             console.error('api enroll error:', error);
//         }
//     }
// }