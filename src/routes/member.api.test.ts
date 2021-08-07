import request from "supertest"
import { app } from '../app'
import { MemberRepo } from "../repositories/memberRepo";
import { mockConnection } from "../mock/mockDbTestConnection";
import { encrypt, decrypt } from "../moudles/rsa";
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
describe("test post /api/member ", () => {
    it(" it should return status 200 if correct enroll", async () => {
        //correct enroll
        const repo = new MemberRepo()
        const jsonData = JSON.stringify(repo.generateFixedMemberMockData())
        const encryptData = encrypt(jsonData)
        const response1 = await request(app).post("/api/member").send({ 'encryptData': encryptData });
        expect(response1.statusCode).toBe(200);
    });
    it(" it should return status 400 if repeat enroll", async () => {
        //repeat enroll
        const repo = new MemberRepo()
        const jsonData1 = JSON.stringify(repo.generateFixedMemberMockData())
        const encryptData1 = encrypt(jsonData1)
        const response1 = await request(app).post("/api/member").send({ 'encryptData': encryptData1 });
        // expect(response1.statusCode).toBe(200);
        const jsonData2 = JSON.stringify(repo.generateFixedMemberMockData())
        const encryptData2 = encrypt(jsonData2)
        const response2 = await request(app).post("/api/member").send({ 'encryptData': encryptData2 });
        expect(response2.statusCode).toBe(401);
    });
    it(" it should return status 400 if use error format", async () => {
        //error format
        const jsonData3 = JSON.stringify({ account: 'ss' })
        const encryptData3 = encrypt(jsonData3)
        const response3 = await request(app).post("/api/member").send({ 'encryptData': encryptData3 });
        expect(response3.statusCode).toBe(400);
    });
});