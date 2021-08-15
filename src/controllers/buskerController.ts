
import { Request, response, Response } from 'express';
import { Busker } from "../entities/Busker";
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