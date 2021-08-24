import request from "supertest"
import { app } from '../app'
import * as memberRepo from "../repositories/memberRepo";
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
    await mockConnection.close();
});
describe(`test post ${prefixApiPath}${apiPath.enroll}(enroll) `, () => {
    let postData
    beforeEach(async () => {

        postData = mockRequestData.generateEncryptSendData(memberRepo.generateFixedMemberMockData())
    });
    it(" it should return status 200 if correct enroll", async () => {
        const response = await request(app).post(prefixApiPath + apiPath.enroll).send({ ...postData });
        expect(response.statusCode).toBe(200);
    });
    it(" it should return status 400 if repeat enroll", async () => {
        //repeat enroll
        const response1 = await request(app).post(prefixApiPath + apiPath.enroll).send({ ...postData });
        expect(response1.statusCode).toBe(200);
        const response2 = await request(app).post(prefixApiPath + apiPath.enroll).send({ ...postData });
        expect(response2.statusCode).toBe(401);
    });
    it(" it should return status 400 if use error format", async () => {
        //error format
        const wrongData = mockRequestData.generateEncryptSendData({ account: 'ss' })
        const response = await request(app).post(prefixApiPath + apiPath.enroll).send({ ...wrongData });
        expect(response.statusCode).toBe(400);
    });
});
describe(`test post ${prefixApiPath}${apiPath.login}(login)`, () => {
    let mockMember
    beforeEach(async () => {
        mockMember = memberRepo.generateFixedMemberMockData()
        await request(app).post(prefixApiPath + apiPath.enroll).send({ ...mockRequestData.generateEncryptSendData(mockMember) });
    });
    it(" it should return status 200 if use correct account and password", async () => {
        const loginData = memberRepo.generateLoginData(mockMember.account, mockMember.password)
        const loginResult = await request(app).post(prefixApiPath + apiPath.login).send({ ...mockRequestData.generateEncryptSendData(loginData) });
        expect(loginResult.statusCode).toBe(200);
    });
    it(" it should return status 401 if use wrong account ", async () => {
        const wrongAccountData = memberRepo.generateLoginData('mockAccount', mockMember.password)
        const wrongAccountResult = await request(app).post(prefixApiPath + apiPath.login).send({ ...mockRequestData.generateEncryptSendData(wrongAccountData) });
        expect(wrongAccountResult.statusCode).toBe(401);
    });
    it(" it should return status 401 if use wrong  password", async () => {
        const wrongPasswordData = memberRepo.generateLoginData(mockMember.account, 'mockPassword')
        const wrongPasswordResult = await request(app).post(prefixApiPath + apiPath.login).send({ ...mockRequestData.generateEncryptSendData(wrongPasswordData) });
        expect(wrongPasswordResult.statusCode).toBe(401);
    });
});
describe(`test get ${prefixApiPath}${apiPath.memberInfo} and put ${prefixApiPath}${apiPath.memberInfo}(get and update memberInfo)`, () => {
    let cookies;
    beforeEach(async () => {
        try {
            const mockMember = memberRepo.generateFixedMemberMockData()
            const enrollResult = await request(app).post(prefixApiPath + apiPath.member).send({ ...mockRequestData.generateEncryptSendData(mockMember) })
            expect(enrollResult.statusCode).toBe(200);
            const loginData = memberRepo.generateLoginData(mockMember.account, mockMember.password)
            const res = await request(app).post(prefixApiPath + apiPath.login).send({ ...mockRequestData.generateEncryptSendData(loginData) }).expect(200);
            cookies = res.headers["set-cookie"].pop().split(";")[0];
        } catch (error) {
            console.error('error:', error);
        }
    });
    it(" get /api/memberInfo:it should return status 200 if use correct login", async () => {
        const memberInfoResult = await request(app).get(prefixApiPath + apiPath.memberInfo).set("Cookie", [cookies])
        expect(memberInfoResult.statusCode).toBe(200);
    });
    it(" put /api/memberInfo:it should return status 200 if use correct login", async () => {
        const mockMemberData = memberRepo.generateFixedMemberMockData()
        mockMemberData.name = 'mock'
        const memberInfoResult = await request(app).put(prefixApiPath + apiPath.memberInfo).set("Cookie", [cookies]).send({ ...mockRequestData.generateEncryptSendData(mockMemberData) })
        expect(memberInfoResult.statusCode).toBe(200);
    });

});