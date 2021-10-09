"use strict";
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
const app_1 = require("../../src/app");
const memberRepo_1 = require("../repositories/memberRepo");
const mockDbTestConnection_1 = require("../mock/mockDbTestConnection");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("beforeAll");
    const connection = yield mockDbTestConnection_1.mockConnection.create();
    console.log("Has connected to DB? ", connection.isConnected);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("afterAll");
    yield mockDbTestConnection_1.mockConnection.close();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("beforeEach");
    yield mockDbTestConnection_1.mockConnection.clear();
}));
describe("member repo test", () => {
    it("Test enroll:it should be return 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new memberRepo_1.MemberRepo();
        const result = yield repo.enroll(repo.generateFixedMemberMockData());
        console.log("result:", result);
        expect(result.status).toBe(200);
    }));
});
describe("member api test ", () => {
    it("post /api/member: it should return status 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new memberRepo_1.MemberRepo();
        const response = yield supertest_1.default(app_1.app).post("/api/member").send(repo.generateFixedMemberMockData());
        expect(response.statusCode).toBe(200);
    }));
});
//# sourceMappingURL=member.test.js.map