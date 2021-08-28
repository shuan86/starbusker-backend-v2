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
let cookies
const requestEnrollMember = async (data = null) => {
    const result = await request(app).post(prefixApiPath + apiPath.enroll).send(mockRequestData.generateEncryptSendData({ ...data }));
    return result
}
const requestLogin = async (data = null) => {
    const result = await request(app).post(prefixApiPath + apiPath.login).send({ ...mockRequestData.generateEncryptSendData(data) });
    return result
}
const requestGetMemberInfo = async (data = null) => {
    const result = await request(app).get(prefixApiPath + apiPath.memberInfo).set("Cookie", [cookies])
    return result
}
const requestPutMemberInfo = async (data = null) => {
    const result = await request(app).put(prefixApiPath + apiPath.memberInfo).set("Cookie", [cookies]).send({ ...mockRequestData.generateEncryptSendData(data) })
    return result
}
describe(`test post ${prefixApiPath}${apiPath.enroll}(enroll member) `, () => {
    let postData
    beforeEach(async () => {
        postData = memberRepo.generateFixedMemberMockData()
    });
    it(" it should return status 200 if correct enroll", async () => {
        const response = await requestEnrollMember(postData);
        expect(response.statusCode).toBe(200);
    });
    it(" it should return status 400 if repeat enroll", async () => {
        //repeat enroll
        const response1 = await requestEnrollMember(postData);
        expect(response1.statusCode).toBe(200);
        const response2 = await requestEnrollMember(postData);
        expect(response2.statusCode).toBe(401);
    });
    it(" it should return status 400 if use error format", async () => {
        //error format
        const wrongData = mockRequestData.generateEncryptSendData({ account: 'ss' })
        const response = await requestEnrollMember(wrongData);
        expect(response.statusCode).toBe(400);
    });
});
describe(`test post ${prefixApiPath}${apiPath.login}(login)`, () => {
    let mockMember
    beforeEach(async () => {
        mockMember = memberRepo.generateFixedMemberMockData()
        // await request(app).post(prefixApiPath + apiPath.enroll).send({ ...mockRequestData.generateEncryptSendData(mockMember) });
        await requestEnrollMember(mockMember);
    });
    it(" it should return status 200 if use correct account and password", async () => {
        const loginData = memberRepo.generateLoginData(mockMember.account, mockMember.password)
        const loginResult = await requestLogin(loginData)
        expect(loginResult.statusCode).toBe(200);
    });
    it(" it should return status 401 if use wrong account ", async () => {
        const wrongAccountData = memberRepo.generateLoginData('mockAccount', mockMember.password)
        const wrongAccountResult = await requestLogin(wrongAccountData)
        expect(wrongAccountResult.statusCode).toBe(401);
    });
    it(" it should return status 401 if use wrong  password", async () => {
        const wrongPasswordData = memberRepo.generateLoginData(mockMember.account, 'mockPassword')
        const wrongPasswordResult = await await requestLogin(wrongPasswordData);
        expect(wrongPasswordResult.statusCode).toBe(401);
    });
});
describe(`test get ${prefixApiPath}${apiPath.memberInfo} and put ${prefixApiPath}${apiPath.memberInfo}(get and update memberInfo)`, () => {
    beforeEach(async () => {
        try {
            const mockMember = memberRepo.generateFixedMemberMockData()
            const enrollResult = await requestEnrollMember(mockMember)
            const loginData = memberRepo.generateLoginData(mockMember.account, mockMember.password)
            const res = await requestLogin(loginData)
            cookies = res.headers["set-cookie"].pop().split(";")[0];
        } catch (error) {
            console.error('error:', error);
        }
    });
    it(" get /api/memberInfo:it should return status 200 if use correct login", async () => {
        const memberInfoResult = await requestGetMemberInfo()
        expect(memberInfoResult.statusCode).toBe(200);
    });
    it(" put /api/memberInfo:it should return status 200 if use correct login", async () => {
        const mockMemberData = memberRepo.generateFixedMemberMockData()
        mockMemberData.name = 'mock'
        const memberInfoResult = await requestPutMemberInfo(mockMemberData)
        expect(memberInfoResult.statusCode).toBe(200);
    });

});