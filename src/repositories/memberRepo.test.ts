import { MemberRepo } from "../repositories/memberRepo";
import { mockConnection } from "../mock/mockDbTestConnection";
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
})