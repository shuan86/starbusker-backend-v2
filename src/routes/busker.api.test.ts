import request from "supertest"
import { app } from '../app'
import * as memberRepo from "../repositories/memberRepo";
import * as buskerRepo from "../repositories/buskerRepo";
import { GetPerformancesType, BuskerPerformance } from "../entities/BuskerPerformance";

import { mockConnection } from "../mock/mockDbTestConnection";
import { prefixApiPath, apiPath } from "../config/router";
import * as mockRequestData from "../utils/request";
beforeAll(async () => {
    const connection = await mockConnection.create();
    console.log("beforeAll Has connected to DB? ", connection.isConnected);
});
let cookies;
let memberId;
let enrollBuskerData;
beforeEach(async () => {
    await mockConnection.clearAllRepo();
    const mockMember = memberRepo.generateFixedMemberMockData()
    const enrollResult = await request(app).post(prefixApiPath + apiPath.member).send({ ...mockRequestData.generateEncryptSendData(mockMember) })
    expect(enrollResult.statusCode).toBe(200);
    const loginData = memberRepo.generateLoginData(mockMember.account, mockMember.password)
    const res = await request(app).post(prefixApiPath + apiPath.login).send({ ...mockRequestData.generateEncryptSendData(loginData) }).expect(200);
    cookies = res.headers["set-cookie"].pop().split(";")[0];
    memberId = await memberRepo.getIdByAccount(mockMember.account)
    enrollBuskerData = buskerRepo.generateEnrollBusker("description", 0)
});
afterAll(async () => {
    // await memberRepo.clear()
    await mockConnection.close();
});
describe(`test post ${prefixApiPath}${apiPath.enroll}(enroll busker)`, () => {
    it(" it should return status 200 if correct enroll", async () => {
        const enrollResult = await request(app).post(prefixApiPath + apiPath.enrollBusker).set("Cookie", [cookies]).send({ ...mockRequestData.generateEncryptSendData({ ...enrollBuskerData }) })
        expect(enrollResult.statusCode).toBe(200);
    });
    it(" it should return status 200 if  repeat enroll", async () => {
        const enrollResult = await request(app).post(prefixApiPath + apiPath.enrollBusker).set("Cookie", [cookies]).send({ ...mockRequestData.generateEncryptSendData({ ...enrollBuskerData }) })
        expect(enrollResult.statusCode).toBe(200);
        const enrollResult1 = await request(app).post(prefixApiPath + apiPath.enrollBusker).set("Cookie", [cookies]).send({ ...mockRequestData.generateEncryptSendData({ ...enrollBuskerData }) })
        expect(enrollResult1.statusCode).toBe(401)
    });
    it(" it should return status 401 if use incorrect parameter", async () => {
        const enrollResult1 = await request(app).post(prefixApiPath + apiPath.enrollBusker).set("Cookie", [cookies]).send({ ...mockRequestData.generateEncryptSendData({}) })
        expect(enrollResult1.statusCode).toBe(400)
    });


});
describe(`test post ${prefixApiPath}${apiPath.performances}( Apply busker performance)`, () => {
    let performanceData
    beforeEach(async () => {
        const enrollBuskerResult = await request(app).post(prefixApiPath + apiPath.enrollBusker).set("Cookie", [cookies]).send({ ...mockRequestData.generateEncryptSendData({ ...enrollBuskerData }) })
        performanceData = buskerRepo.generateDiffPerformanceData(memberId, buskerRepo.getCurrentDate())
    });

    it(" it should return status 200 if correct apply", async () => {
        const result = await request(app).post(prefixApiPath + apiPath.performances).set("Cookie", [cookies]).send({ ...mockRequestData.generateSendData({ ...performanceData }) })
        expect(result.statusCode).toBe(200);
    });
    it(" it should return status 400 if incorrect apply", async () => {
        const result = await request(app).post(prefixApiPath + apiPath.performances).set("Cookie", [cookies]).send({ ...mockRequestData.generateSendData({}) })
        expect(result.statusCode).toBe(400);
    });
});

describe(`test get ${prefixApiPath}${apiPath.performancesTime}(get all time of busker performance)`, () => {
    beforeEach(async () => {
        const enrollBuskerResult = await request(app).post(prefixApiPath + apiPath.enrollBusker).set("Cookie", [cookies]).send({ ...mockRequestData.generateEncryptSendData({ ...enrollBuskerData }) })
        const performanceData = buskerRepo.generateDiffPerformanceData(memberId, buskerRepo.getCurrentDate())
        const applyResult = await request(app).post(prefixApiPath + apiPath.performances).set("Cookie", [cookies]).send({ ...mockRequestData.generateSendData({ ...performanceData }) })
    });

    it(" it should return status 200 if correct enroll", async () => {
        const result = await request(app).get(prefixApiPath + apiPath.performancesTime).set("Cookie", [cookies]).send({})
        // console.error('123:', result.text);
        expect(result.statusCode).toBe(200);
    });

});
describe(`test get ${prefixApiPath}${apiPath.performances}(get specific busker performance)`, () => {
    let performanceData: BuskerPerformance
    beforeEach(async () => {
        const enrollBuskerResult = await request(app).post(prefixApiPath + apiPath.enrollBusker).set("Cookie", [cookies]).send({ ...mockRequestData.generateEncryptSendData({ ...enrollBuskerData }) })
        performanceData = buskerRepo.generateDiffPerformanceData(memberId, buskerRepo.getCurrentDate())
        const applyResult = await request(app).post(prefixApiPath + apiPath.performances)
            .set("Cookie", [cookies]).send({ ...mockRequestData.generateSendData({ ...performanceData }) })
    });

    it(" it should return status 200 if correct enroll", async () => {
        const getPerformancesData: GetPerformancesType = {
            page: 1,
            time: `${performanceData.time.getUTCFullYear()}-${performanceData.time.getMonth() + 1}-${performanceData.time.getDate()}`
        }
        const result = await request(app).get(prefixApiPath + apiPath.performances)
            .set("Cookie", [cookies]).query({ ...mockRequestData.generateSendData({ ...getPerformancesData }) })
        // console.error('123:', result.text);
        expect(result.statusCode).toBe(200);
    });

});
