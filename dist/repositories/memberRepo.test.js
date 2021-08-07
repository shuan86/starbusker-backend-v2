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
Object.defineProperty(exports, "__esModule", { value: true });
const memberRepo_1 = require("../repositories/memberRepo");
const mockDbTestConnection_1 = require("../mock/mockDbTestConnection");
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
describe("member repo test", () => {
    it("Test enroll:it should be return 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new memberRepo_1.MemberRepo();
        const result = yield repo.enroll(repo.generateFixedMemberMockData());
        console.log("result:", result);
        expect(result.status).toBe(200);
    }));
});
//# sourceMappingURL=memberRepo.test.js.map