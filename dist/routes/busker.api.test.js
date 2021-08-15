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
const buskerRepo = __importStar(require("../repositories/buskerRepo"));
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
    // await memberRepo.clear()
    yield mockDbTestConnection_1.mockConnection.close();
}));
describe(`test post ${router_1.prefixApiPath}${router_1.apiPath.enroll}(enroll busker)`, () => {
    let cookies;
    let memberId;
    let mockBusker;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const mockMember = memberRepo.generateFixedMemberMockData();
            const enrollResult = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.member).send(Object.assign({}, mockRequestData.generateEncryptPostData(mockMember)));
            expect(enrollResult.statusCode).toBe(200);
            const loginData = memberRepo.generateLoginData(mockMember.account, mockMember.password);
            const res = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.login).send(Object.assign({}, mockRequestData.generateEncryptPostData(loginData))).expect(200);
            cookies = res.headers["set-cookie"].pop().split(";")[0];
            memberId = yield memberRepo.getIdByAccount(mockMember.account);
            mockBusker = buskerRepo.generateFixedMockData(memberId);
        }
        catch (error) {
            console.error('error:', error);
        }
    }));
    it(" it should return status 200 if correct enroll", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const enrollResult = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.applyBusker).set("Cookie", [cookies]).send(Object.assign({}, mockRequestData.generateEncryptPostData(Object.assign({}, mockBusker))));
            expect(enrollResult.statusCode).toBe(200);
        }
        catch (error) {
            console.error('error:', error);
        }
    }));
    it(" it should return status 200 if use incorrect parameter", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const enrollResult = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.applyBusker).set("Cookie", [cookies]).send(Object.assign({}, mockRequestData.generateEncryptPostData(Object.assign({}, mockBusker))));
            expect(enrollResult.statusCode).toBe(200);
            const enrollResult1 = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.applyBusker).set("Cookie", [cookies]).send(Object.assign({}, mockRequestData.generateEncryptPostData(Object.assign({}, mockBusker))));
            expect(enrollResult1.statusCode).toBe(401);
        }
        catch (error) {
            console.error('error:', error);
        }
    }));
    it(" it should return status 401 if use Incorrect parameter", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const enrollResult1 = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.applyBusker).set("Cookie", [cookies]).send(Object.assign({}, mockRequestData.generateEncryptPostData({})));
            expect(enrollResult1.statusCode).toBe(400);
        }
        catch (error) {
            console.error('error:', error);
        }
        // const enrollResult2 = await request(app).post(prefixApiPath + apiPath.applyBusker).set("Cookie", [cookies]).send({ ...mockRequestData.generateEncryptPostData({}) })
        // await expect(enrollResult2.statusCode).resolves.toBe(400)
    }));
});
//# sourceMappingURL=busker.api.test.js.map