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
let cookies;
let memberId;
let enrollBuskerData;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mockDbTestConnection_1.mockConnection.clearAllRepo();
    const mockMember = memberRepo.generateFixedMemberMockData();
    const enrollResult = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.member).send(Object.assign({}, mockRequestData.generateEncryptSendData(mockMember)));
    expect(enrollResult.statusCode).toBe(200);
    const loginData = memberRepo.generateLoginData(mockMember.account, mockMember.password);
    const res = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.login).send(Object.assign({}, mockRequestData.generateEncryptSendData(loginData))).expect(200);
    cookies = res.headers["set-cookie"].pop().split(";")[0];
    memberId = yield memberRepo.getIdByAccount(mockMember.account);
    enrollBuskerData = buskerRepo.generateEnrollBusker("description", 0);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // await memberRepo.clear()
    yield mockDbTestConnection_1.mockConnection.close();
}));
const requestEnrollBusker = (data = null) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.enrollBusker).set("Cookie", [cookies]).send(Object.assign({}, mockRequestData.generateSendData(Object.assign({}, data))));
    return result;
});
const requestApplyPerformance = (data = null) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.performance).set("Cookie", [cookies]).send(Object.assign({}, mockRequestData.generateSendData(Object.assign({}, data))));
    return result;
});
const requestDeletePerformance = (data = null) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield supertest_1.default(app_1.app).delete(router_1.prefixApiPath + router_1.apiPath.performance).set("Cookie", [cookies]).send(Object.assign({}, mockRequestData.generateSendData(Object.assign({}, data))));
    return result;
});
const requestGetPerformance = (data = null) => __awaiter(void 0, void 0, void 0, function* () {
    const result = supertest_1.default(app_1.app).get(router_1.prefixApiPath + router_1.apiPath.performances)
        .set("Cookie", [cookies]).query(Object.assign({}, mockRequestData.generateSendData(Object.assign({}, data))));
    return result;
});
describe(`test post ${router_1.prefixApiPath}${router_1.apiPath.enroll}(enroll busker)`, () => {
    it(" it should return status 200 if correct enroll", () => __awaiter(void 0, void 0, void 0, function* () {
        const enrollResult = yield requestEnrollBusker(enrollBuskerData);
        expect(enrollResult.statusCode).toBe(200);
    }));
    it(" it should return status 200 if  repeat enroll", () => __awaiter(void 0, void 0, void 0, function* () {
        const enrollResult = yield requestEnrollBusker(enrollBuskerData);
        expect(enrollResult.statusCode).toBe(200);
        const enrollResult1 = yield requestEnrollBusker(enrollBuskerData);
        expect(enrollResult1.statusCode).toBe(401);
    }));
    it(" it should return status 401 if use incorrect parameter", () => __awaiter(void 0, void 0, void 0, function* () {
        const enrollResult1 = yield requestEnrollBusker();
        expect(enrollResult1.statusCode).toBe(400);
    }));
});
describe(`test post ${router_1.prefixApiPath}${router_1.apiPath.performance}( Apply busker performance)`, () => {
    let performanceData;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield requestEnrollBusker(enrollBuskerData);
        performanceData = buskerRepo.generateDiffPerformanceData(memberId, buskerRepo.getCurrentDate());
    }));
    it(" it should return status 200 if correct apply", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield requestApplyPerformance(performanceData);
        expect(result.statusCode).toBe(200);
    }));
    it(" it should return status 400 if incorrect apply", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield requestApplyPerformance();
        expect(result.statusCode).toBe(400);
    }));
});
describe(`test delete ${router_1.prefixApiPath}${router_1.apiPath.performance}( Delete busker performance)`, () => {
    let applyData;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield requestEnrollBusker(enrollBuskerData);
        const performanceData = buskerRepo.generateDiffPerformanceData(memberId, buskerRepo.getCurrentDate());
        const applyResult = yield requestApplyPerformance(performanceData);
        applyData = JSON.parse(applyResult.text);
    }));
    it(" it should return status 200 if use correct perofrmance id", () => __awaiter(void 0, void 0, void 0, function* () {
        const performanceData = { id: applyData.id };
        const result = yield requestDeletePerformance(performanceData);
        expect(result.statusCode).toBe(200);
    }));
    it(" it should return status 200 if use correct perofrmance id", () => __awaiter(void 0, void 0, void 0, function* () {
        const performanceData = { id: applyData.id };
        const result = yield requestDeletePerformance(performanceData);
        expect(result.statusCode).toBe(200);
    }));
});
describe(`test get ${router_1.prefixApiPath}${router_1.apiPath.performancesTime}(get all time of busker performance)`, () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield requestEnrollBusker(enrollBuskerData);
        const performanceData = buskerRepo.generateDiffPerformanceData(memberId, buskerRepo.getCurrentDate());
        const applyResult = yield supertest_1.default(app_1.app).post(router_1.prefixApiPath + router_1.apiPath.performance).set("Cookie", [cookies]).send(Object.assign({}, mockRequestData.generateSendData(Object.assign({}, performanceData))));
    }));
    it(" it should return status 200 if correct enroll", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield supertest_1.default(app_1.app).get(router_1.prefixApiPath + router_1.apiPath.performancesTime).set("Cookie", [cookies]).send({});
        expect(result.statusCode).toBe(200);
    }));
});
describe(`test get ${router_1.prefixApiPath}${router_1.apiPath.performance}(get specific busker performance)`, () => {
    let performanceData;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const enrollBuskerResult = yield requestEnrollBusker(enrollBuskerData);
        performanceData = buskerRepo.generateDiffPerformanceData(memberId, buskerRepo.getCurrentDate());
        const applyResult = yield requestApplyPerformance(performanceData);
    }));
    it(" it should return status 200 if correct enroll", () => __awaiter(void 0, void 0, void 0, function* () {
        const getPerformancesData = {
            page: 1,
            time: `${performanceData.time.getUTCFullYear()}-${performanceData.time.getMonth() + 1}-${performanceData.time.getDate()}`
        };
        const result = yield requestGetPerformance(getPerformancesData);
        expect(result.statusCode).toBe(200);
    }));
    it(" it should return status 400 if use incorrect enroll", () => __awaiter(void 0, void 0, void 0, function* () {
        const getPerformancesData = {
            page: 1,
            time: `${performanceData.time.getUTCFullYear()}-${performanceData.time.getMonth() + 1}-${performanceData.time.getDate()}`
        };
        const result = yield requestGetPerformance();
        expect(result.statusCode).toBe(400);
    }));
});
//# sourceMappingURL=busker.api.test.js.map