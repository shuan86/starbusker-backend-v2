import request from "supertest"
import { app } from '../app'
import { MemberRepo } from "../repositories/memberRepo";
import { mockConnection } from "../mock/mockDbTestConnection";
import * as mockRequestData from "../utils/request";

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

export const apiPath = {
    member: '/api/member',
    login: '/api/login',
    memberInfo: '/api/memberInfo'
}
describe("test post /api/member ", () => {
    it(" it should return status 200 if correct enroll", async () => {
        //correct enroll
        const repo = new MemberRepo()
        const postData = mockRequestData.generateEncryptPostData(repo.generateFixedMemberMockData())
        const response = await request(app).post(apiPath.member).send({ ...postData });
        expect(response.statusCode).toBe(200);
    });
    it(" it should return status 400 if repeat enroll", async () => {
        //repeat enroll
        const repo = new MemberRepo()
        const postData1 = mockRequestData.generateEncryptPostData(repo.generateFixedMemberMockData())
        const response1 = await request(app).post(apiPath.member).send({ ...postData1 });
        expect(response1.statusCode).toBe(200);
        const postData2 = mockRequestData.generateEncryptPostData(repo.generateFixedMemberMockData())
        const response2 = await request(app).post(apiPath.member).send({ ...postData2 });
        expect(response2.statusCode).toBe(401);
    });
    it(" it should return status 400 if use error format", async () => {
        //error format
        const postData = mockRequestData.generateEncryptPostData({ account: 'ss' })
        const response = await request(app).post(apiPath.member).send({ ...postData });
        expect(response.statusCode).toBe(400);
    });
});
describe("test post /api/login ", () => {
    it(" it should return status 200 if use correct account and password", async () => {
        const repo = new MemberRepo()
        const mockMember = repo.generateFixedMemberMockData()
        const enrollResult = await request(app).post(apiPath.member).send({ ...mockRequestData.generateEncryptPostData(mockMember) });
        expect(enrollResult.statusCode).toBe(200);
        const loginData = repo.generateLoginData(mockMember.account, mockMember.password)
        const loginResult = await request(app).post(apiPath.login).send({ ...mockRequestData.generateEncryptPostData(loginData) });
        expect(loginResult.statusCode).toBe(200);
    });
    it(" it should return status 401 if use wrong account or password", async () => {
        const repo = new MemberRepo()
        const mockMember = repo.generateFixedMemberMockData()
        const enrollResult = await request(app).post(apiPath.member).send({ ...mockRequestData.generateEncryptPostData(mockMember) });
        expect(enrollResult.statusCode).toBe(200);
        const wrongAccountData = repo.generateLoginData('mockAccount', mockMember.password)
        const wrongAccountResult = await request(app).post(apiPath.login).send({ ...mockRequestData.generateEncryptPostData(wrongAccountData) });
        expect(wrongAccountResult.statusCode).toBe(401);
        const wrongPasswordData = repo.generateLoginData(mockMember.account, 'mockPassword')
        const wrongPasswordResult = await request(app).post(apiPath.login).send({ ...mockRequestData.generateEncryptPostData(wrongPasswordData) });
        expect(wrongPasswordResult.statusCode).toBe(401);
    });
});

describe("test get /api/memberInfo and put /api/memberInfo", () => {
    let cookies;
    beforeEach((done) => {
        const repo = new MemberRepo()
        const mockMember = repo.generateFixedMemberMockData()
        const enrollResult = request(app).post(apiPath.member).send({ ...mockRequestData.generateEncryptPostData(mockMember) }).then((res) => {
            const loginData = repo.generateLoginData(mockMember.account, mockMember.password)
            request(app).post(apiPath.login).send({ ...mockRequestData.generateEncryptPostData(loginData) }).expect(200, (err, res) => {
                if (err) return done(err);
                // expect(res.headers).property("set-cookie");
                cookies = res.headers["set-cookie"].pop().split(";")[0];
                done();
            });
        });
    });
    it(" get /api/memberInfo:it should return status 200 if use correct login", async () => {
        const memberInfoResult = await request(app).get(apiPath.memberInfo).set("Cookie", [cookies])
        expect(memberInfoResult.statusCode).toBe(200);
    });
    it(" put /api/memberInfo:it should return status 200 if use correct login", async () => {
        const repo = new MemberRepo()
        const mockMemberData = repo.generateFixedMemberMockData()
        mockMemberData.name = 'mock'
        const memberInfoResult = await request(app).put(apiPath.memberInfo).set("Cookie", [cookies]).send({ ...mockRequestData.generateEncryptPostData(mockMemberData) })
        expect(memberInfoResult.statusCode).toBe(200);
        // const getmemberInfoResult = await request(app).get(apiPath.memberInfo).set("Cookie", [cookies])
        // expect(getmemberInfoResult.).toBe(200);
    });

});