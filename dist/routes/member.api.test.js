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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const memberRepo = __importStar(require("../repositories/memberRepo"));
const mockDbTestConnection_1 = require("../mock/mockDbTestConnection");
const router_1 = require("../config/router");
const mockRequestData = __importStar(require("../utils/request"));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield mockDbTestConnection_1.mockConnection.create();
    console.log("beforeAll Has connected to DB? ", connection.isConnected);
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mockDbTestConnection_1.mockConnection.clearAllRepo();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mockDbTestConnection_1.mockConnection.close();
}));
describe(`test post ${router_1.prefixApiPath}${router_1.apiPath.enroll}(enroll) `, () => {
    let postData;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        postData = mockRequestData.generateEncryptPostData(memberRepo.generateFixedMemberMockData());
    }));
    it(" it should return status 200 if correct enroll", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.enroll).send(Object.assign({}, postData));
        expect(response.statusCode).toBe(200);
    }));
    it(" it should return status 400 if repeat enroll", () => __awaiter(void 0, void 0, void 0, function* () {
        //repeat enroll
        // const repo = new MemberRepo()
        const response1 = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.enroll).send(Object.assign({}, postData));
        expect(response1.statusCode).toBe(200);
        const response2 = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.enroll).send(Object.assign({}, postData));
        expect(response2.statusCode).toBe(401);
    }));
    it(" it should return status 400 if use error format", () => __awaiter(void 0, void 0, void 0, function* () {
        //error format
        const wrongData = mockRequestData.generateEncryptPostData({ account: 'ss' });
        const response = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.enroll).send(Object.assign({}, wrongData));
        expect(response.statusCode).toBe(400);
    }));
});
describe(`test post ${router_1.prefixApiPath}${router_1.apiPath.login}(login)`, () => {
    let mockMember;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        mockMember = memberRepo.generateFixedMemberMockData();
        yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.enroll).send(Object.assign({}, mockRequestData.generateEncryptPostData(mockMember)));
    }));
    it(" it should return status 200 if use correct account and password", () => __awaiter(void 0, void 0, void 0, function* () {
        const loginData = memberRepo.generateLoginData(mockMember.account, mockMember.password);
        const loginResult = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.login).send(Object.assign({}, mockRequestData.generateEncryptPostData(loginData)));
        expect(loginResult.statusCode).toBe(200);
    }));
    it(" it should return status 401 if use wrong account ", () => __awaiter(void 0, void 0, void 0, function* () {
        const wrongAccountData = memberRepo.generateLoginData('mockAccount', mockMember.password);
        const wrongAccountResult = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.login).send(Object.assign({}, mockRequestData.generateEncryptPostData(wrongAccountData)));
        expect(wrongAccountResult.statusCode).toBe(401);
    }));
    it(" it should return status 401 if use wrong  password", () => __awaiter(void 0, void 0, void 0, function* () {
        const wrongPasswordData = memberRepo.generateLoginData(mockMember.account, 'mockPassword');
        const wrongPasswordResult = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.login).send(Object.assign({}, mockRequestData.generateEncryptPostData(wrongPasswordData)));
        expect(wrongPasswordResult.statusCode).toBe(401);
    }));
});
describe(`test get ${router_1.prefixApiPath}${router_1.apiPath.memberInfo} and put ${router_1.prefixApiPath}${router_1.apiPath.memberInfo}(get and update memberInfo)`, () => {
    let cookies;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mockMember = memberRepo.generateFixedMemberMockData();
            const enrollResult = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.member).send(Object.assign({}, mockRequestData.generateEncryptPostData(mockMember)));
            expect(enrollResult.statusCode).toBe(200);
            const loginData = memberRepo.generateLoginData(mockMember.account, mockMember.password);
            const res = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.login).send(Object.assign({}, mockRequestData.generateEncryptPostData(loginData))).expect(200);
            cookies = res.headers["set-cookie"].pop().split(";")[0];
        }
        catch (error) {
            console.error('error:', error);
        }
    }));
    it(" get /api/memberInfo:it should return status 200 if use correct login", () => __awaiter(void 0, void 0, void 0, function* () {
        const memberInfoResult = yield supertest_1.default(app_1.app).get(router_1.prefixApiPath + router_1.apiPath.memberInfo).set("Cookie", [cookies]);
        expect(memberInfoResult.statusCode).toBe(200);
    }));
    it(" put /api/memberInfo:it should return status 200 if use correct login", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockMemberData = memberRepo.generateFixedMemberMockData();
        mockMemberData.name = 'mock';
        const memberInfoResult = yield supertest_1.default(app_1.app).put(router_1.prefixApiPath + router_1.apiPath.memberInfo).set("Cookie", [cookies]).send(Object.assign({}, mockRequestData.generateEncryptPostData(mockMemberData)));
        expect(memberInfoResult.statusCode).toBe(200);
    }));
});
//# sourceMappingURL=member.api.test.js.map