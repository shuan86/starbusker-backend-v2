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
const memberRepo_1 = require("./memberRepo");
const buskerRepo_1 = require("./buskerRepo");
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
describe("busker repo test", () => {
    it("Test apply:it should be return 200 if use correct member id", () => __awaiter(void 0, void 0, void 0, function* () {
        const buskerRepo = new buskerRepo_1.BuskerRepo();
        const member = new memberRepo_1.MemberRepo();
        const memberData = member.generateFixedMemberMockData();
        const buskerData = buskerRepo.generateFixedMockData(memberData.id);
        databaseRepo_1.getBuskerRepo().findOne = jest.fn().mockReturnValue(null);
        const result = yield buskerRepo.apply(memberData.id, buskerData);
        expect(result.status).toBe(200);
    }));
    it("Test apply:it should be return 401 if use wrong member id", () => __awaiter(void 0, void 0, void 0, function* () {
        const buskerRepo = new buskerRepo_1.BuskerRepo();
        const member = new memberRepo_1.MemberRepo();
        const memberData = member.generateFixedMemberMockData();
        const buskerData = buskerRepo.generateFixedMockData(memberData.id);
        databaseRepo_1.getBuskerRepo().findOne = jest.fn().mockReturnValue(Object.assign({}, buskerData));
        const result = yield buskerRepo.apply(memberData.id, buskerData);
        expect(result.status).toBe(401);
    }));
    it("Test apply:it should be return 401 if use wrong member id", () => __awaiter(void 0, void 0, void 0, function* () {
        const buskerRepo = new buskerRepo_1.BuskerRepo();
        const member = new memberRepo_1.MemberRepo();
        const memberData = member.generateFixedMemberMockData();
        const buskerData = buskerRepo.generateFixedMockData(memberData.id);
        databaseRepo_1.getBuskerRepo().findOne = jest.fn().mockReturnValue(Object.assign({}, buskerData));
        const result = yield buskerRepo.apply(memberData.id, buskerData);
        expect(result.status).toBe(401);
    }));
});
//# sourceMappingURL=buskerRepo.test.js.map