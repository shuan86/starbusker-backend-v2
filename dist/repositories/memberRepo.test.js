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
Object.defineProperty(exports, "__esModule", { value: true });
const mockDbTestConnection_1 = require("../mock/mockDbTestConnection");
const memberRepo = __importStar(require("../repositories/memberRepo"));
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield mockDbTestConnection_1.mockConnection.create();
    console.log("beforeAll Has connected to DB? ", connection.isConnected);
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // await memberRepo.clear()
    yield mockDbTestConnection_1.mockConnection.clearAllRepo();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // await memberRepo.clear()
    yield mockDbTestConnection_1.mockConnection.close();
}));
describe("member repo test(enroll)", () => {
    it("Test enroll:it should be return 200 if use correct format", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield memberRepo.enroll(memberRepo.generateFixedMemberMockData());
        expect(result.status).toBe(200);
    }));
    it("Test enroll:it should be return 200 if repeat enroll", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield memberRepo.enroll(memberRepo.generateFixedMemberMockData());
        expect(result.status).toBe(200);
    }));
});
describe("member repo test(login) ", () => {
    let member;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        member = memberRepo.generateFixedMemberMockData();
        const result = yield memberRepo.enroll(memberRepo.generateFixedMemberMockData());
        expect(result.status).toBe(200);
    }));
    it("Test login:it should be return 200 if use correct account and password", () => __awaiter(void 0, void 0, void 0, function* () {
        const loginData = memberRepo.generateLoginData(member.account, member.password);
        const result = yield memberRepo.login(Object.assign({}, loginData));
        expect(result.status).toBe(200);
    }));
    it("Test login:it should be return 401 if use wrong account", () => __awaiter(void 0, void 0, void 0, function* () {
        const wrongAccountloginData = memberRepo.generateLoginData('*7897987945643213465465', member.password);
        const wrongAccointResult = yield memberRepo.login(Object.assign({}, wrongAccountloginData));
        expect(wrongAccointResult.status).toBe(401); //wrong account
    }));
    it("Test login:it should be return 401 if use wrong  password", () => __awaiter(void 0, void 0, void 0, function* () {
        const wrongPasswordloginData = memberRepo.generateLoginData(member.account, '*7897987945643213465465');
        const wrongPasswordResult = yield memberRepo.login(Object.assign({}, wrongPasswordloginData));
        expect(wrongPasswordResult.status).toBe(401); //wrong password
    }));
});
describe("member repo test(getMemberInfoById and updateMemberInfoById)", () => {
    let member;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        member = memberRepo.generateFixedMemberMockData();
        const result = yield memberRepo.createMember(memberRepo.generateFixedMemberMockData());
        member = result;
    }));
    it("Test getMemberInfoById:it should be return t0 if use correct member id(0)", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield memberRepo.getMemberInfoDataById(member.id);
        expect(result.account).toBe(member.account); //wrong account
    }));
    it("Test getMemberInfoById:it should be return null if use wrong member id(-1)", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield memberRepo.getMemberInfoDataById(-1);
        expect(result).toBe(null); //wrong account
    }));
    it("Test updateMemberInfoById:it should be return 200 if use correct member id and set name:mockname and password:456", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUpdateMemberInfoData = memberRepo.generateMemberInfoData(member.name, member.password, member.email);
        const result = yield memberRepo.updateMemberInfoById(member.id, mockUpdateMemberInfoData);
        expect(result.status).toBe(200);
    }));
    it("Test updateMemberInfoById:it should be return 401 if use wrong member id and set name:mockname and password:456", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockUpdateMemberInfoData = memberRepo.generateMemberInfoData(member.name, member.password, member.email);
        const result = yield memberRepo.updateMemberInfoById(-1, mockUpdateMemberInfoData);
        expect(result.status).toBe(401);
    }));
});
//# sourceMappingURL=memberRepo.test.js.map