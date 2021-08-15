
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
    // let memberData
    // let buskerData
    beforeEach(async () => {
        // memberData = memberRepo.generateFixedMemberMockData()
        // memberData = await memberRepo.createMember({ ...memberData })
        // buskerData = buskerRepo.generateFixedMockData(memberData.id)
    });
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
        // memberData = memberRepo.generateFixedMemberMockData()
        // memberData = await memberRepo.createMember({ ...memberData })
        // buskerData = buskerRepo.generateFixedMockData(memberData.id)
        buskerData = await buskerRepo.createBusker({ ...buskerData })
    });
    it("Test apply:it should be return 200 if use correct  format", async () => {
        const time = buskerRepo.getCurrentData()
        const result = await buskerRepo.applyPerformance(buskerRepo.generatePerformance(buskerData.id, 'mockTitle', 'mockDecscription', time, '110台北市信義區市府路1號'))
        expect(result.status).toBe(200)
    })
    // it("Test apply:it should be return 200 if repeat enroll", async () => {
    //     const result1 = await buskerRepo.enroll(buskerData)
    //     expect(result1.status).toBe(200)
    //     const result2 = await buskerRepo.enroll(buskerData)
    //     expect(result2.status).toBe(401)
    // })

})