
import { mockConnection } from "../mock/mockDbTestConnection";
import * as memberRepo from "./memberRepo";
import * as buskerRepo from "./buskerRepo";
import { FrontEndPerformanceType, FrontEndHighestOnlineAmountType, FrontEndFuturePerformanceDataType, } from "../entities/BuskerPerformance";
import { FrontEndCommentDataType, FrontEndHighestComentAmountType, FrontEndWeekCommentAmountType } from "../entities/BuskerPerformanceComment";

import { describe, expect, test } from '@jest/globals'
import { ReponseType } from "types/reponseType";
import { addTime, getCurrentFullTimeStr, addDay } from '../moudles/time';

beforeAll(async () => {
    const connection = await mockConnection.create();
    console.log("beforeAll Has connected to DB? ", connection.isConnected);
});
let memberData
let buskerData
beforeEach(async () => {
    //create member
    await mockConnection.clearAllRepo();
    memberData = await memberRepo.generateDiffMemberMockData()
    memberData = await memberRepo.createMember({ ...memberData })
    buskerData = buskerRepo.generateFixedMockData(memberData.id)
    // buskerData = await buskerRepo.createBusker({ ...buskerData })
});
afterAll(async () => {

    await mockConnection.close();
});
describe("busker repo test(enroll)", () => {
    test("Test enroll and isBuskerByMemberId:it should be return 200 if use correct member id", async () => {
        const result = await buskerRepo.enroll({ ...buskerData })
        expect(result.status).toBe(200)
    })
    test("Test enroll:it should be return 200 if repeat enroll", async () => {
        const result1 = await buskerRepo.enroll({ ...buskerData })
        expect(result1.status).toBe(200)
    })
})
describe("busker repo test(applyPerformance)", () => {
    beforeEach(async () => {
        buskerData = await buskerRepo.createBusker({ ...buskerData })
    });
    it("Test apply:it should be return 200 if use correct  format", async () => {
        const result = await buskerRepo.applyPerformance(buskerRepo.generatePerformance(buskerData.id, 'mockTitle', 'mockDecscription'
            , getCurrentFullTimeStr(), '110台北市信義區市府路1號'))
        expect(result.status).toBe(200)
    })
})
describe("busker repo test(isPerformanceExist)", () => {
    let performanceData: FrontEndPerformanceType
    beforeEach(async () => {
        buskerData = await buskerRepo.createBusker({ ...buskerData })
        const result = await buskerRepo.applyPerformance(buskerRepo.generatePerformance(buskerData.id, 'mockTitle', 'mockDecscription'
            , getCurrentFullTimeStr(), '110台北市信義區市府路1號'))

        performanceData = JSON.parse(result.data)
    });
    it("Test isPerformanceExist:it should be return true if use correct perforance id", async () => {
        const result = await buskerRepo.isPerformanceExist(performanceData.performanceId)
        expect(result).toBe(true)
    })
    it("Test isPerformanceExist:it should be return false if use incorrect perforance id", async () => {
        const result = await buskerRepo.isPerformanceExist(-1)
        expect(result).toBe(false)
    })
})
describe("busker repo test(deletePerformance)", () => {
    let performanceData: FrontEndPerformanceType
    beforeEach(async () => {
        buskerData = await buskerRepo.createBusker({ ...buskerData })
        const reponse = await buskerRepo.applyPerformance(buskerRepo.generatePerformance(buskerData.id, 'mockTitle', 'mockDecscription'
            , getCurrentFullTimeStr(), '110台北市信義區市府路1號'))
        performanceData = JSON.parse(reponse.data)
    });
    it("Test delete:it should be return 200 if use correct perforance id", async () => {
        const result = await buskerRepo.deletePerformance(performanceData.performanceId)
        expect(result.status).toBe(200)
        const isPerformanceExist = await buskerRepo.isPerformanceExist(performanceData.performanceId)
        expect(isPerformanceExist).toBe(false)
    })
    it("Test delete:it should be return 401 if use incorrect perforance id", async () => {
        const result = await buskerRepo.deletePerformance(-1)
        expect(result.status).toBe(401)
    })

})

describe("busker repo test(getAllPerformanceTime)", () => {
    let memberArr = []
    let buskerArr = []
    beforeEach(async () => {
        for (let i = 0; i < 3; i++) {
            memberData = await memberRepo.generateDiffMemberMockData()
            memberData = await memberRepo.createMember(memberData)
            memberArr.push(memberData)
            let buskerData = buskerRepo.generateDiffMockData(memberData.id)
            buskerData = await buskerRepo.createBusker(buskerData)
            buskerArr.push(buskerData)
        }
        const timeStr = getCurrentFullTimeStr()


        for (let i = 0; i < buskerArr.length; i++) {
            const performanceData = buskerRepo.generateDiffPerformanceData(buskerArr[i].id
                , addTime(timeStr, 0, i, i))

            await buskerRepo.applyMockPerformance(performanceData)
        }
    });
    it("Test get all Performance time :it should be return 200 if use correct  format", async () => {
        const result = await buskerRepo.getAllPerformanceTime()
        expect(result.status).toBe(200)
    })


})
describe("busker repo test(getPerformances)", () => {
    let memberArr = []
    let buskerArr = []
    beforeEach(async () => {
        for (let i = 0; i < 1; i++) {
            memberData = await memberRepo.generateDiffMemberMockData()
            memberData = await memberRepo.createMember(memberData)
            memberArr.push(memberData)
            let buskerData = buskerRepo.generateDiffMockData(memberData.id)
            buskerData = await buskerRepo.createBusker(buskerData)
            buskerArr.push(buskerData)
        }
        const timeStr = getCurrentFullTimeStr()
        let date = 0
        let hour = 0
        let minute = 0
        for (let i = 0; i < buskerArr.length; i++) {
            const performanceData = buskerRepo.generateDiffPerformanceData(buskerArr[i].id
                , addTime(timeStr, 0, date, hour, minute))
            if (i >= 10 && i % 10 == 0) {
                date++
                hour++
            }
            minute = Math.random() * 60
            await buskerRepo.applyMockPerformance(performanceData)
        }
    });
    it("Test get Performances :it should be return 200 if use correct  format", async () => {
        const timeStr = getCurrentFullTimeStr()
        const result = await buskerRepo.getPerformances(timeStr, 1)
        expect(result.status).toBe(200)
    })


})
describe("busker repo test(createPerformanceComment)", () => {
    const testStr = 'testStr'
    let performanceData: FrontEndPerformanceType
    beforeEach(async () => {
        buskerData = await buskerRepo.createBusker({ ...buskerData })
        const result = await buskerRepo.applyPerformance(buskerRepo.generatePerformance(buskerData.id, 'mockTitle', 'mockDecscription'
            , getCurrentFullTimeStr(), '110台北市信義區市府路1號'))
        performanceData = JSON.parse(result.data)
    });
    it("Test createPerformanceComment :it should be return true if use correct  format", async () => {
        await buskerRepo.createPerformanceComment({
            id: 0, buskerId: buskerData.id, performanceId: performanceData.performanceId, memberId: buskerData.memberId
            , comment: testStr, time: undefined, buskerPerformance: undefined, busker: undefined, member: undefined
        })
        const result = await buskerRepo.getPerformanceCommentsByBuskerId(buskerData.id)
        expect(result.status).toBe(200)
        const dataArr: FrontEndCommentDataType[] = JSON.parse(result.data)
        let isFindComment = false
        for (const data of dataArr) {
            if (data.comment == testStr)
                isFindComment = true
        }
        expect(isFindComment).toBe(true)
    })

})
describe("busker repo test(getTop5MaxOnlineAmount,getTop5NewestMaxCommentAmount,getWeekCommentAmount and getFuturePerformancesData)", () => {
    const testStr = 'testStr'
    let performanceData: FrontEndPerformanceType
    beforeEach(async () => {
        buskerData = await buskerRepo.createBusker({ ...buskerData })
        const curTimeStr = getCurrentFullTimeStr()
        for (let i = 0; i < 1; i++) {

            for (let j = 0; j < 7; j++) {
                const futurePerformanceResponse = await buskerRepo.applyPerformance(buskerRepo.generatePerformance(buskerData.id, 'mockTitle', 'mockDecscription'
                    , addDay(curTimeStr, j), `110台北市信義區市府路${i}號`))
                const performanceResponse = await buskerRepo.applyPerformance(buskerRepo.generatePerformance(buskerData.id, 'mockTitle', 'mockDecscription'
                    , addDay(curTimeStr, -(j)), `110台北市信義區市府路${i}號`))
                const performanceData: FrontEndPerformanceType = JSON.parse(performanceResponse.data)
                const memberId = await buskerRepo.getMemberIdByBuskerId(buskerData.id)
                await buskerRepo.createPerformanceComment({
                    id: 0, buskerId: buskerData.id, performanceId: performanceData.performanceId
                    , comment: `${j}`, time: addDay(curTimeStr, -(j)), memberId: memberId, buskerPerformance: undefined, busker: undefined
                    , member: undefined
                })

                await buskerRepo.updateMaxChatroomOnlineAmount(performanceData.performanceId, i)
            }
        }
    });
    it("Test getTop5MaxOnlineAmount :it should be return 200 if use correct  format", async () => {
        const result = await buskerRepo.getTop5NewestHighestOnlineAmount(buskerData.id)
        const data: FrontEndHighestOnlineAmountType = JSON.parse(result.data)
        expect(result.status).toBe(200)
    })
    it("Test getTop5NewestMaxCommentAmount :it should be return 200 if use correct  format", async () => {
        const result = await buskerRepo.getTop5HighestCommentAmount(buskerData.id)
        const data: FrontEndHighestComentAmountType = JSON.parse(result.data)
        expect(result.status).toBe(200)
    })
    it("Test getWeekCommentAmount :it should be return 200 if use correct  format", async () => {
        const result = await buskerRepo.getWeekCommentAmount(buskerData.id)
        const data: FrontEndWeekCommentAmountType = JSON.parse(result.data)
        expect(result.status).toBe(200)
    })
    it("Test getFuturePerformancesData :it should be return 200 if use correct  format", async () => {
        const result = await buskerRepo.getFuturePerformancesData(buskerData.id)
        const data: FrontEndFuturePerformanceDataType = JSON.parse(result.data)
        expect(result.status).toBe(200)
    })

})