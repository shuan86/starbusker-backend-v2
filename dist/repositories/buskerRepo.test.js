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
const memberRepo = __importStar(require("./memberRepo"));
const buskerRepo = __importStar(require("./buskerRepo"));
const globals_1 = require("@jest/globals");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield mockDbTestConnection_1.mockConnection.create();
    console.log("beforeAll Has connected to DB? ", connection.isConnected);
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // buskerRepo.clear()
    // memberRepo.clear()
    yield mockDbTestConnection_1.mockConnection.clearAllRepo();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mockDbTestConnection_1.mockConnection.close();
}));
globals_1.describe("busker repo test(enroll)", () => {
    let memberData;
    let buskerData;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // await mockConnection.clear();
        memberData = memberRepo.generateFixedMemberMockData();
        memberData = yield memberRepo.createMember(Object.assign({}, memberData));
        buskerData = buskerRepo.generateFixedMockData(memberData.id);
    }));
    globals_1.test("Test enroll:it should be return 200 if use correct member id", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield buskerRepo.enroll(Object.assign({}, buskerData));
        globals_1.expect(result.status).toBe(200);
    }));
    globals_1.test("Test enroll:it should be return 200 if repeat enroll", () => __awaiter(void 0, void 0, void 0, function* () {
        const result1 = yield buskerRepo.enroll(Object.assign({}, buskerData));
        globals_1.expect(result1.status).toBe(200);
        const result2 = yield buskerRepo.enroll(Object.assign({}, buskerData));
        globals_1.expect(result2.status).toBe(401);
    }));
});
globals_1.describe("busker repo test(apply)", () => {
    let memberData;
    let buskerData;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        memberData = memberRepo.generateFixedMemberMockData();
        yield memberRepo.enroll(memberData);
        memberData.id = yield memberRepo.getIdByAccount(memberData.account);
        buskerData = buskerRepo.generateFixedMockData(memberData.id);
    }));
    it("Test apply:it should be return 200 if use correct member id", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield buskerRepo.enroll(buskerData);
        globals_1.expect(result.status).toBe(200);
    }));
    it("Test apply:it should be return 200 if repeat enroll", () => __awaiter(void 0, void 0, void 0, function* () {
        const result1 = yield buskerRepo.enroll(buskerData);
        globals_1.expect(result1.status).toBe(200);
        const result2 = yield buskerRepo.enroll(buskerData);
        globals_1.expect(result2.status).toBe(401);
    }));
});
//# sourceMappingURL=buskerRepo.test.js.map