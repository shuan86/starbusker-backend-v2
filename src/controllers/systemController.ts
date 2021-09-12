
import { Request, response, Response } from 'express';
import { Busker } from "../entities/Busker";
import * as memberRepo from '../repositories/memberRepo';
import * as buskerRepo from '../repositories/buskerRepo';
import { FrontEndPerformanceType } from '../entities/BuskerPerformance';
import { addDay, addTime, getCurrentFullTimeStr } from '../moudles/time';

import { plainToClass, Expose } from "class-transformer";


export const init = async (req: Request, res: Response) => {
    try {
        await buskerRepo.clear()
        await memberRepo.clear()
        let memberArr = []
        let buskerArr = []
        console.log('start init');
        memberRepo.setMockMemberCount(0)
        for (let i = 0; i < 2; i++) {
            let memberData = await memberRepo.generateDiffMemberMockData()
            memberData = await memberRepo.createMember(memberData)
            memberArr.push(memberData)
            let buskerData = buskerRepo.generateDiffMockData(memberData.id)
            buskerData = await buskerRepo.createBusker(buskerData)
            buskerArr.push(buskerData)
        }
        const curTimeStr = getCurrentFullTimeStr()
        let month = 0
        let date = 0
        let hour = 0
        let minute = 0

        for (let i = 0; i < buskerArr.length; i++) {

            for (let j = 0; j < 10; j++) {
                const futurePerformanceMockData = buskerRepo.generateDiffPerformanceData(buskerArr[i].id
                    , addDay(curTimeStr, date + j))
                const futurePerformanceResponse = await buskerRepo.applyPerformance(
                    futurePerformanceMockData)
                const performanceMockData = buskerRepo.generateDiffPerformanceData(buskerArr[i].id
                    , addDay(curTimeStr, date - j))

                if (j >= 10 && j % 10 == 0) {
                    date++
                    hour++
                }
                minute = Math.random() * 60
                const performanceResponse = await buskerRepo.applyPerformance(performanceMockData)
                const performanceData: FrontEndPerformanceType = JSON.parse(performanceResponse.data)
                const memberId = await buskerRepo.getMemberIdByBuskerId(buskerArr[i].id)
                await buskerRepo.createPerformanceComment({
                    id: 0, buskerId: buskerArr[i].id, performanceId: performanceData.performanceId
                    , comment: `comment${j}`, time: addDay(curTimeStr, date - j), memberId: memberId, buskerPerformance: undefined, busker: undefined
                    , member: undefined
                })
                await buskerRepo.updateMaxChatroomOnlineAmount(performanceData.performanceId, 1 + j)
            }
        }
        console.log('init done');
        res.status(200).send('sucessful init')
        return
    } catch (error) {
        console.error('error:', error);

    }

    res.status(501).send('fail init')
    res.status(200).send('fail init')



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