
import { Request, response, Response } from 'express';
import { Busker } from "../entities/Busker";
import { BuskerPerformance, GetPerformancesType } from "../entities/BuskerPerformance";

// import { buskerRepo } from '../repositories/buskerRepo';
import * as  buskerRepo from '../repositories/buskerRepo';

import { plainToClass, Expose } from "class-transformer";
import { validate } from "class-validator";
import { decrypt } from "../moudles/rsa";
import { LoginType, FrontEndMemberDataType } from '../types/memberType'




export const enroll = async (req: Request, res: Response) => {
    try {
        const encryptData = req.body.encryptData
        const data = decrypt(encryptData)
        const busker = plainToClass(Busker, JSON.parse(data))
        const errors = await validate(busker, { skipMissingProperties: true })
        if (errors.length > 0) {
            // console.error(errors);
            res.status(400).send(`parameter error`);
            return;
        } else {
            busker.memberId = req.session.member
            const result = await buskerRepo.enroll(busker)
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
        const data = req.body.data
        const performance = plainToClass(GetPerformancesType, JSON.parse(data))
        const errors = await validate(performance, { skipMissingProperties: true })
        if (errors.length > 0) {
            // console.error(errors);
            res.status(400).send(`parameter error`);
            return;
        } else {
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
            const result = await buskerRepo.getPerformances(buskerRepo.setCurrentData(year, month, date), performance.page)
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


export const applyPerformance = async (req: Request, res: Response) => {
    try {
        const data = req.body.data
        const performance = plainToClass(BuskerPerformance, JSON.parse(data))
        const errors = await validate(performance, { skipMissingProperties: true })
        if (errors.length > 0) {
            // console.error(errors);
            res.status(400).send(`parameter error`);
            return;
        } else {
            const memberId = req.session.member
            const buskerId = await buskerRepo.getIdByMemberId(memberId)
            performance.buskerId = buskerId
            const result = await buskerRepo.applyPerformance(performance)
            if (result.status == 200 || result.status == 401) {
                res.status(result.status).send(result.data)
            }
            else {
                res.status(500).send('server is busying')
            }
        }
    } catch (error) {
        console.error('api applyPerformance error:', error);
    }
}
export const getAllPerformanceTime = async (req: Request, res: Response) => {
    try {

        const memberId = req.session.member
        const buskerId = await buskerRepo.getIdByMemberId(memberId)
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