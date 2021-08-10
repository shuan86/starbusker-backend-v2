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
const databaseRepo_1 = require("./databaseRepo");
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
    it("Test login:it should be return 200 if use correct account and password", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new memberRepo_1.MemberRepo();
        const member = repo.generateFixedMemberMockData();
        databaseRepo_1.getMemberRepos().findOne = jest.fn().mockReturnValue(Object.assign({}, member));
        const loginData = repo.generateLoginData(member.account, member.password);
        const result = yield repo.login(loginData);
        console.log("result:", result);
        expect(result.status).toBe(200);
    }));
    it("Test login:it should be return 401 if use wrong account or password", () => __awaiter(void 0, void 0, void 0, function* () {
        const repo = new memberRepo_1.MemberRepo();
        const member = repo.generateFixedMemberMockData();
        databaseRepo_1.getMemberRepos().findOne = jest.fn().mockReturnValue(null);
        const wrongPasswordloginData = repo.generateLoginData(member.account, '*7897987945643213465465');
        const wrongPasswordResult = yield repo.login(wrongPasswordloginData);
        expect(wrongPasswordResult.status).toBe(401); //wrong password
        databaseRepo_1.getMemberRepos().findOne = jest.fn().mockReturnValue(null);
        const wrongAccountloginData = repo.generateLoginData('*7897987945643213465465', member.password);
        const wrongAccointResult = yield repo.login(wrongAccountloginData);
        expect(wrongAccointResult.status).toBe(401); //wrong account
    }));
});
//# sourceMappingURL=memberRepo.test.js.map