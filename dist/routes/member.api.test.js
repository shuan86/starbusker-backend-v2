"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiPath = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const memberRepo_1 = require("../repositories/memberRepo");
const mockDbTestConnection_1 = require("../mock/mockDbTestConnection");
const mockRequestData = __importStar(require("../utils/request"));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield mockDbTestConnection_1.mockConnection.create();
    console.log("beforeAll Has connected to DB? ", connection.isConnected);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mockDbTestConnection_1.mockConnection.close();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mockDbTestConnection_1.mockConnection.clear();
}));
exports.apiPath = {
    enroll: '/api/enroll',
    login: '/api/login',
    memberInfo: '/api/memberInfo'
};
describe("test post /api/member ", () => {
    it(" it should return status 200 if correct enroll", () => __awaiter(void 0, void 0, void 0, function* () {
        //correct enroll
        const repo = new memberRepo_1.MemberRepo();
        const postData = mockRequestData.generateEncryptPostData(repo.generateFixedMemberMockData());
        const response = yield supertest_1.default(app_1.app).post(exports.apiPath.enroll).send(Object.assign({}, postData));
        expect(response.statusCode).toBe(200);
    }));
    it(" it should return status 400 if repeat enroll", () => __awaiter(void 0, void 0, void 0, function* () {
        //repeat enroll
        const repo = new memberRepo_1.MemberRepo();
        const postData1 = mockRequestData.generateEncryptPostData(repo.generateFixedMemberMockData());
        const response1 = yield supertest_1.default(app_1.app).post(exports.apiPath.enroll).send(Object.assign({}, postData1));
        expect(response1.statusCode).toBe(200);
        const postData2 = mockRequestData.generateEncryptPostData(repo.generateFixedMemberMockData());
        const response2 = yield supertest_1.default(app_1.app).post(exports.apiPath.enroll).send(Object.assign({}, postData2));
        expect(response2.statusCode).toBe(401);
    }));
    it(" it should return status 400 if use error format", () => __awaiter(void 0, void 0, void 0, function* () {
        //error format
        const postData = mockRequestData.generateEncryptPostData({ account: 'ss' });
        const response = yield supertest_1.default(app_1.app).post(exports.apiPath.enroll).send(Object.assign({}, postData));
        expect(response.statusCode).toBe(400);
    }));
});
describe("test post /api/login ", () => {
    it(" it should return status 200 if use correct account and password", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new memberRepo_1.MemberRepo();
        const mockMember = repo.generateFixedMemberMockData();
        const enrollResult = yield supertest_1.default(app_1.app).post(exports.apiPath.enroll).send(Object.assign({}, mockRequestData.generateEncryptPostData(mockMember)));
        expect(enrollResult.statusCode).toBe(200);
        const loginData = repo.generateLoginData(mockMember.account, mockMember.password);
        const loginResult = yield supertest_1.default(app_1.app).post(exports.apiPath.login).send(Object.assign({}, mockRequestData.generateEncryptPostData(loginData)));
        expect(loginResult.statusCode).toBe(200);
    }));
    it(" it should return status 401 if use wrong account or password", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new memberRepo_1.MemberRepo();
        const mockMember = repo.generateFixedMemberMockData();
        const enrollResult = yield supertest_1.default(app_1.app).post(exports.apiPath.enroll).send(Object.assign({}, mockRequestData.generateEncryptPostData(mockMember)));
        expect(enrollResult.statusCode).toBe(200);
        const wrongAccountData = repo.generateLoginData('mockAccount', mockMember.password);
        const wrongAccountResult = yield supertest_1.default(app_1.app).post(exports.apiPath.login).send(Object.assign({}, mockRequestData.generateEncryptPostData(wrongAccountData)));
        expect(wrongAccountResult.statusCode).toBe(401);
        const wrongPasswordData = repo.generateLoginData(mockMember.account, 'mockPassword');
        const wrongPasswordResult = yield supertest_1.default(app_1.app).post(exports.apiPath.login).send(Object.assign({}, mockRequestData.generateEncryptPostData(wrongPasswordData)));
        expect(wrongPasswordResult.statusCode).toBe(401);
    }));
});
describe("test get /api/memberInfo and post /api/memberInfo", () => {
    let cookies;
    beforeEach((done) => {
        const repo = new memberRepo_1.MemberRepo();
        const mockMember = repo.generateFixedMemberMockData();
        const enrollResult = supertest_1.default(app_1.app).post(exports.apiPath.enroll).send(Object.assign({}, mockRequestData.generateEncryptPostData(mockMember))).then((res) => {
            const loginData = repo.generateLoginData(mockMember.account, mockMember.password);
            supertest_1.default(app_1.app).post(exports.apiPath.login).send(Object.assign({}, mockRequestData.generateEncryptPostData(loginData))).expect(200, (err, res) => {
                if (err)
                    return done(err);
                // expect(res.headers).property("set-cookie");
                cookies = res.headers["set-cookie"].pop().split(";")[0];
                done();
            });
        });
    });
    it(" get /api/memberInfo:it should return status 200 if use correct login", () => __awaiter(void 0, void 0, void 0, function* () {
        const memberInfoResult = yield supertest_1.default(app_1.app).get(exports.apiPath.memberInfo).set("Cookie", [cookies]);
        expect(memberInfoResult.statusCode).toBe(200);
    }));
    it(" put /api/memberInfo:it should return status 200 if use correct login", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new memberRepo_1.MemberRepo();
        const mockMemberData = repo.generateFixedMemberMockData();
        mockMemberData.name = 'mock';
        const memberInfoResult = yield supertest_1.default(app_1.app).post(exports.apiPath.memberInfo).set("Cookie", [cookies]).send(Object.assign({}, mockRequestData.generateEncryptPostData(mockMemberData)));
        expect(memberInfoResult.statusCode).toBe(200);
        // const getmemberInfoResult = await request(app).get(apiPath.memberInfo).set("Cookie", [cookies])
        // expect(getmemberInfoResult.).toBe(200);
    }));
});
//# sourceMappingURL=member.api.test.js.map