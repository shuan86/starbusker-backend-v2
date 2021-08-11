import { MemberRepo } from "../repositories/memberRepo";
import { mockConnection } from "../mock/mockDbTestConnection";
import { getMemberRepos } from './databaseRepo'

beforeAll(async () => {
    const connection = await mockConnection.create();
    console.log("beforeAll Has connected to DB? ", connection.isConnected);
});
afterAll(async () => {
    await mockConnection.close();
});

beforeEach(async () => {
    await mockConnection.clear();
});
describe("member repo test", () => {
    it("Test enroll:it should be return 200", async () => {
        const repo = new MemberRepo()
        const result = await repo.enroll(repo.generateFixedMemberMockData())
        console.log("result:", result);
        expect(result.status).toBe(200)
    })
    it("Test login:it should be return 200 if use correct account and password", async () => {
        const repo = new MemberRepo()
        const member = repo.generateFixedMemberMockData()
        getMemberRepos().findOne = jest.fn().mockReturnValue({ ...member })
        const loginData = repo.generateLoginData(member.account, member.password)
        const result = await repo.login(loginData)
        console.log("result:", result);
        expect(result.status).toBe(200)
    })
    it("Test login:it should be return 401 if use wrong account or password", async () => {
        const repo = new MemberRepo()
        const member = repo.generateFixedMemberMockData()
        getMemberRepos().findOne = jest.fn().mockReturnValue(null)
        const wrongPasswordloginData = repo.generateLoginData(member.account, '*7897987945643213465465')
        const wrongPasswordResult = await repo.login(wrongPasswordloginData)
        expect(wrongPasswordResult.status).toBe(401)//wrong password
        getMemberRepos().findOne = jest.fn().mockReturnValue(null)
        const wrongAccountloginData = repo.generateLoginData('*7897987945643213465465', member.password)
        const wrongAccointResult = await repo.login(wrongAccountloginData)
        expect(wrongAccointResult.status).toBe(401)//wrong account

    })
    it("Test getMemberInfoById:it should be return t0 if use correct member id(0)", async () => {
        const repo = new MemberRepo()
        const member = repo.generateFixedMemberMockData()
        getMemberRepos().findOne = jest.fn().mockReturnValue(member)
        const result = await repo.getMemberInfoDataById(member.id)
        expect(result.account).toBe(member.account)//wrong account
    })
    it("Test getMemberInfoById:it should be return null if use wrong member id(-1)", async () => {
        const repo = new MemberRepo()
        const member = repo.generateFixedMemberMockData()
        getMemberRepos().findOne = jest.fn().mockReturnValue(null)
        const result = await repo.getMemberInfoDataById(-1)
        expect(result).toBe(null)//wrong account
    })
    it("Test updateMemberInfoById:it should be return 200 if use correct member id and set name:mockname and password:456", async () => {
        const repo = new MemberRepo()
        const member = repo.generateFixedMemberMockData()
        const mockUpdateMemberInfoData = repo.generateMemberInfoData(member.name, member.password, member.email)
        getMemberRepos().findOne = jest.fn().mockReturnValue(member)
        getMemberRepos().save = jest.fn().mockReturnValue(null)
        const result = await repo.updateMemberInfoById(member.id, mockUpdateMemberInfoData)
        expect(result.status).toBe(200)
    })
    it("Test updateMemberInfoById:it should be return 401 if use wrong member id and set name:mockname and password:456", async () => {
        const repo = new MemberRepo()
        const member = repo.generateFixedMemberMockData()
        const mockUpdateMemberInfoData = repo.generateMemberInfoData(member.name, member.password, member.email)
        getMemberRepos().findOne = jest.fn().mockReturnValue(null)
        getMemberRepos().save = jest.fn().mockReturnValue(null)
        const result = await repo.updateMemberInfoById(-1, mockUpdateMemberInfoData)
        expect(result.status).toBe(401)
    })
})