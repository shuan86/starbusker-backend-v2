import request from "supertest"
import { app } from '../../src/app'
import { MemberRepo } from "../repositories/memberRepo";
import { mockConnection } from "../mock/mockDbTestConnection";
beforeAll(async () => {
    console.log("beforeAll");

    const connection = await mockConnection.create();
    console.log("Has connected to DB? ", connection.isConnected);
});
afterAll(async () => {
    console.log("afterAll");

    await mockConnection.close();
});

beforeEach(async () => {
    console.log("beforeEach");

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

describe("member api test ", () => {
    it("post /api/member: it should return status 200", async () => {
        const repo = new MemberRepo()
        const response = await request(app).post("/api/member").send(repo.generateFixedMemberMockData());
        expect(response.statusCode).toBe(200);
    });
});