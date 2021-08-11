
import { Request, response, Response } from 'express';
import { Busker } from "../entities/Busker";
import { buskerRepo } from '../repositories/buskerRepo';
import { plainToClass, Expose } from "class-transformer";
import { validate } from "class-validator";
import { decrypt } from "../moudles/rsa";
import { LoginType, FrontEndMemberDataType } from '../types/memberType'
declare module 'express-session' {
    interface SessionData {
        member: number;
    }
}
// export const init = async (req: Request, res: Response) => {
//     try {
//         await buskerRepo.enroll(buskerRepo.generateFixedMockData())
//         res.status(200).send('sucessful init')
//     } catch (error) {
//         console.error('api enroll error:', error);
//     }
// }



// export const apply = async (req: Request, res: Response) => {
//     try {
//         const encryptData = req.body.encryptData
//         const data = decrypt(encryptData)
//         const member = plainToClass(Busker, JSON.parse(data))
//         const errors = await validate(member, { skipMissingProperties: true })
//         if (errors.length > 0) {
//             // console.error(errors);
//             res.status(400).send(`parameter error`);
//             return;
//         } else {
//             const result = await buskerRepo.apply(member)
//             if (result.status == 200 || result.status == 401) {
//                 res.status(result.status).send(result.data)
//             }
//             else {
//                 res.status(500).send('server is busying')
//             }
//         }
//     } catch (error) {
//         console.error('api enroll error:', error);
//     }
// }

export const logout = (req: Request, res: Response) => {
    try {

        req.session.destroy(() => {
            console.log('session destroyed')
        })
        res.status(200).send('')
    } catch (error) {
        console.error('api logout error:', error);
    }
}