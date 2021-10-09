import { mockConnection } from "../mock/mockDbTestConnection";
import * as memberRepo from "../repositories/memberRepo";
beforeAll(async () => {
    const connection = await mockConnection.create();
    console.log("beforeAll Has connected to DB? ", connection.isConnected);
});
beforeEach(async () => {
    // await memberRepo.clear()
    await mockConnection.clearAllRepo();

});
afterAll(async () => {
    // await memberRepo.clear()
    await mockConnection.close();
});

describe("member repo test(enroll)", () => {

    it("Test enroll:it should be return 200 if use correct format", async () => {
        const result = await memberRepo.enroll(memberRepo.generateFixedMemberMockData())
        expect(result.status).toBe(200)

    })
    it("Test enroll:it should be return 200 if repeat enroll", async () => {
        const result = await memberRepo.enroll(memberRepo.generateFixedMemberMockData())
        expect(result.status).toBe(200)

    })
})
describe("member repo test(login) ", () => {
    let member
    beforeEach(async () => {
        member = memberRepo.generateFixedMemberMockData()
        const result = await memberRepo.enroll(memberRepo.generateFixedMemberMockData())
        expect(result.status).toBe(200)

    });
    it("Test login:it should be return 200 if use correct account and password", async () => {
        const loginData = memberRepo.generateLoginData(member.account, member.password)
        const result = await memberRepo.login({ ...loginData })
        expect(result.status).toBe(200)
    })
    it("Test login:it should be return 401 if use wrong account", async () => {
        const wrongAccountloginData = memberRepo.generateLoginData('*7897987945643213465465', member.password)
        const wrongAccointResult = await memberRepo.login({ ...wrongAccountloginData })
        expect(wrongAccointResult.status).toBe(401)//wrong account
    })
    it("Test login:it should be return 401 if use wrong  password", async () => {
        const wrongPasswordloginData = memberRepo.generateLoginData(member.account, '*7897987945643213465465')
        const wrongPasswordResult = await memberRepo.login({ ...wrongPasswordloginData })
        expect(wrongPasswordResult.status).toBe(401)//wrong password

    })

})

describe("member repo test(getMemberInfoById,updateMemberInfoById and updateMemberPassword)", () => {
    let member
    beforeEach(async () => {
        member = memberRepo.generateFixedMemberMockData()
        const result = await memberRepo.createMember(memberRepo.generateFixedMemberMockData())
        member = result
    });
    it("Test getMemberInfoById:it should be return t0 if use correct member id(0)", async () => {

        const result = await memberRepo.getMemberInfoDataById(member.id)
        expect(result.account).toBe(member.account)//wrong account
    })
    it("Test getMemberInfoById:it should be return null if use wrong member id(-1)", async () => {

        const result = await memberRepo.getMemberInfoDataById(-1)
        expect(result).toBe(null)//wrong account
    })
    it("Test updateMemberInfoById:it should be return 200 if use correct member id and set name:mockname and password:456", async () => {
        const mockUpdateMemberInfoData = memberRepo.generateMemberInfoData(member.name, member.email)
        const result = await memberRepo.updateMemberInfoById(member.id, mockUpdateMemberInfoData)
        expect(result.status).toBe(200)
    })
    it("Test updateMemberInfoById:it should be return 401 if use wrong member id and set name:mockname and password:456", async () => {
        const mockUpdateMemberInfoData = memberRepo.generateMemberInfoData(member.name, member.email)
        const result = await memberRepo.updateMemberInfoById(-1, mockUpdateMemberInfoData)
        expect(result.status).toBe(401)
    })
    it("Test updateMemberPassword:it should be return 200 if use correct  member id and password", async () => {
        const result = await memberRepo.updateMemberPassword(member.id, member.password, '456')
        expect(result.status).toBe(200)
    })
    it("Test updateMemberPassword:it should be return 401 if use correct  member id and password", async () => {
        const result = await memberRepo.updateMemberPassword(member.id, '-1', '456')
        expect(result.status).toBe(401)
    })
})