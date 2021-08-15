
import { Request, response, Response } from 'express';
import { Busker } from "../entities/Busker";
import * as memberRepo from '../repositories/memberRepo';
import * as buskerRepo from '../repositories/buskerRepo';
import { plainToClass, Expose } from "class-transformer";


export const init = async (req: Request, res: Response) => {
    await buskerRepo.clear()
    await memberRepo.clear()

    for (let i = 0; i < 100; i++) {
        const memberData = memberRepo.generateDiffMemberMockData()
        await memberRepo.enroll(memberData)
        memberData.id = await memberRepo.getIdByAccount(memberData.account)
        const buskerData = buskerRepo.generateDiffMockData(memberData.id)
        buskerData.id = await buskerRepo.getIdByMemberId(memberData.id)
        buskerData.memberId = memberData.id
        await buskerRepo.enroll(buskerData)
        const performanceData = buskerRepo.generateDiffPerformanceMockData(buskerData.id)
        performanceData.id = buskerData.id
        console.log("buskerData.id:", buskerData.id);
        await buskerRepo.applyMockPerformance(buskerData.id, performanceData)

    }
    res.status(200).send('sucessful init')
}



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