import request from "supertest"
import { app } from '../app'
import * as memberRepo from "../repositories/memberRepo";
import * as buskerRepo from "../repositories/buskerRepo";
import { mockConnection } from "../mock/mockDbTestConnection";
import { prefixApiPath, apiPath } from "../config/router";
import * as mockRequestData from "../utils/request";
beforeAll(async () => {
    const connection = await mockConnection.create();
    console.log("beforeAll Has connected to DB? ", connection.isConnected);
});
beforeEach(async () => {
    await mockConnection.clearAllRepo();
});
afterAll(async () => {
    // await memberRepo.clear()
    await mockConnection.close();
});
describe(`test post ${prefixApiPath}${apiPath.enroll}(enroll busker)`, () => {
    let cookies;
    let memberId;
    let enrollBuskerData;
    beforeEach(async () => {
        const mockMember = memberRepo.generateFixedMemberMockData()
        const enrollResult = await request(app).post(prefixApiPath + apiPath.member).send({ ...mockRequestData.generateEncryptPostData(mockMember) })
        expect(enrollResult.statusCode).toBe(200);
        const loginData = memberRepo.generateLoginData(mockMember.account, mockMember.password)
        const res = await request(app).post(prefixApiPath + apiPath.login).send({ ...mockRequestData.generateEncryptPostData(loginData) }).expect(200);
        cookies = res.headers["set-cookie"].pop().split(";")[0];
        memberId = await memberRepo.getIdByAccount(mockMember.account)
        enrollBuskerData = buskerRepo.generateEnrollBusker("description", 0)
    });

    it(" it should return status 200 if correct enroll", async () => {
        const enrollResult = await request(app).post(prefixApiPath + apiPath.applyBusker).set("Cookie", [cookies]).send({ ...mockRequestData.generateEncryptPostData({ ...enrollBuskerData }) })
        expect(enrollResult.statusCode).toBe(200);
    });
    it(" it should return status 200 if  repeat enroll", async () => {
        const enrollResult = await request(app).post(prefixApiPath + apiPath.applyBusker).set("Cookie", [cookies]).send({ ...mockRequestData.generateEncryptPostData({ ...enrollBuskerData }) })
        expect(enrollResult.statusCode).toBe(200);
        const enrollResult1 = await request(app).post(prefixApiPath + apiPath.applyBusker).set("Cookie", [cookies]).send({ ...mockRequestData.generateEncryptPostData({ ...enrollBuskerData }) })
        expect(enrollResult1.statusCode).toBe(401)
    });
    it(" it should return status 401 if use incorrect parameter", async () => {
        const enrollResult1 = await request(app).post(prefixApiPath + apiPath.applyBusker).set("Cookie", [cookies]).send({ ...mockRequestData.generateEncryptPostData({}) })
        expect(enrollResult1.statusCode).toBe(400)
    });


});


