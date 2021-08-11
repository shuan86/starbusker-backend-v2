import { MemberRepo } from "./memberRepo";
import { BuskerRepo } from "./buskerRepo";
import { mockConnection } from "../mock/mockDbTestConnection";
import { getBuskerRepo } from './databaseRepo'

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
describe("busker repo test", () => {
    it("Test apply:it should be return 200 if use correct member id", async () => {
        const buskerRepo = new BuskerRepo()
        const member = new MemberRepo()
        const memberData = member.generateFixedMemberMockData()
        const buskerData = buskerRepo.generateFixedMockData(memberData.id)
        getBuskerRepo().findOne = jest.fn().mockReturnValue(null)
        const result = await buskerRepo.apply(memberData.id, buskerData)
        expect(result.status).toBe(200)
    })
    it("Test apply:it should be return 401 if use wrong member id", async () => {
        const buskerRepo = new BuskerRepo()
        const member = new MemberRepo()
        const memberData = member.generateFixedMemberMockData()
        const buskerData = buskerRepo.generateFixedMockData(memberData.id)
        getBuskerRepo().findOne = jest.fn().mockReturnValue({ ...buskerData })
        const result = await buskerRepo.apply(memberData.id, buskerData)
        expect(result.status).toBe(401)
    })
    it("Test apply:it should be return 401 if use wrong member id", async () => {
        const buskerRepo = new BuskerRepo()
        const member = new MemberRepo()
        const memberData = member.generateFixedMemberMockData()
        const buskerData = buskerRepo.generateFixedMockData(memberData.id)
        getBuskerRepo().findOne = jest.fn().mockReturnValue({ ...buskerData })
        const result = await buskerRepo.apply(memberData.id, buskerData)
        expect(result.status).toBe(401)
    })
})