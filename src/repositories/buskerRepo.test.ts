
import { mockConnection } from "../mock/mockDbTestConnection";
import * as memberRepo from "./memberRepo";
import * as buskerRepo from "./buskerRepo";
import { describe, expect, test } from '@jest/globals'
beforeAll(async () => {
    const connection = await mockConnection.create();
    console.log("beforeAll Has connected to DB? ", connection.isConnected);
});
let memberData
let buskerData
beforeEach(async () => {
    //create member
    await mockConnection.clearAllRepo();
    memberData = memberRepo.generateFixedMemberMockData()
    memberData = await memberRepo.createMember({ ...memberData })
    buskerData = buskerRepo.generateFixedMockData(memberData.id)
    // buskerData = await buskerRepo.createBusker({ ...buskerData })
});
afterAll(async () => {

    await mockConnection.close();
});
describe("busker repo test(enroll)", () => {

    test("Test enroll:it should be return 200 if use correct member id", async () => {
        const result = await buskerRepo.enroll({ ...buskerData })
        expect(result.status).toBe(200)
    })
    test("Test enroll:it should be return 200 if repeat enroll", async () => {
        const result1 = await buskerRepo.enroll({ ...buskerData })
        expect(result1.status).toBe(200)
        const result2 = await buskerRepo.enroll({ ...buskerData })
        expect(result2.status).toBe(401)
    })
})
describe("busker repo test(applyPerformance)", () => {
    // let memberData
    // let buskerData
    beforeEach(async () => {
        //enroll busker
        buskerData = await buskerRepo.createBusker({ ...buskerData })
    });
    it("Test apply:it should be return 200 if use correct  format", async () => {
        // const time = buskerRepo.getCurrentTime()
        const result = await buskerRepo.applyPerformance(buskerRepo.generatePerformance(buskerData.id, 'mockTitle', 'mockDecscription'
            , buskerRepo.getCurrentDate(), '110台北市信義區市府路1號'))
        expect(result.status).toBe(200)
    })


})
describe("busker repo test(getAllPerformanceTime)", () => {
    let memberArr = []
    let buskerArr = []
    beforeEach(async () => {
        for (let i = 0; i < 3; i++) {
            let memberData = await memberRepo.generateDiffMemberMockData()
            memberData = await memberRepo.createMember(memberData)
            memberArr.push(memberData)
            let buskerData = buskerRepo.generateDiffMockData(memberData.id)
            buskerData = await buskerRepo.createBusker(buskerData)
            buskerArr.push(buskerData)
        }
        const time = buskerRepo.getCurrentTime()
        let year = time.year
        let month = time.month
        let date = time.date
        let hour = time.hour
        let minute = time.minute
        for (let i = 0; i < buskerArr.length; i++) {
            const performanceData = buskerRepo.generateDiffPerformanceData(buskerArr[i].id
                , buskerRepo.setCurrentData(year, month, date, hour, minute))
            if (i >= 1) {
                date++
                hour++
            }
            minute = Math.random() * 60
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
            let memberData = await memberRepo.generateDiffMemberMockData()
            memberData = await memberRepo.createMember(memberData)
            memberArr.push(memberData)
            let buskerData = buskerRepo.generateDiffMockData(memberData.id)
            buskerData = await buskerRepo.createBusker(buskerData)
            buskerArr.push(buskerData)
        }
        const time = buskerRepo.getCurrentTime()
        let year = time.year
        let month = time.month
        let date = time.date
        let hour = time.hour
        let minute = time.minute
        for (let i = 0; i < buskerArr.length; i++) {
            const performanceData = buskerRepo.generateDiffPerformanceData(buskerArr[i].id
                , buskerRepo.setCurrentData(year, month, date, hour, minute))
            if (i >= 10 && i % 10 == 0) {
                date++
                hour++
            }
            minute = Math.random() * 60
            await buskerRepo.applyMockPerformance(performanceData)
        }
    });
    it("Test get Performances :it should be return 200 if use correct  format", async () => {
        const time = buskerRepo.getCurrentTime()
        let dateData = buskerRepo.setCurrentData(time.year, time.month, time.date, time.hour, time.minute)
        const result = await buskerRepo.getPerformances(dateData, 1)

        expect(result.status).toBe(200)
    })


})