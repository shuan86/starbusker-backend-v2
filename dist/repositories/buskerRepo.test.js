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
let memberData;
let buskerData;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    //create member
    yield mockDbTestConnection_1.mockConnection.clearAllRepo();
    memberData = memberRepo.generateFixedMemberMockData();
    memberData = yield memberRepo.createMember(Object.assign({}, memberData));
    buskerData = buskerRepo.generateFixedMockData(memberData.id);
    // buskerData = await buskerRepo.createBusker({ ...buskerData })
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mockDbTestConnection_1.mockConnection.close();
}));
globals_1.describe("busker repo test(enroll)", () => {
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
globals_1.describe("busker repo test(applyPerformance)", () => {
    // let memberData
    // let buskerData
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        //enroll busker
        buskerData = yield buskerRepo.createBusker(Object.assign({}, buskerData));
    }));
    it("Test apply:it should be return 200 if use correct  format", () => __awaiter(void 0, void 0, void 0, function* () {
        // const time = buskerRepo.getCurrentTime()
        const result = yield buskerRepo.applyPerformance(buskerRepo.generatePerformance(buskerData.id, 'mockTitle', 'mockDecscription', buskerRepo.getCurrentDate(), '110台北市信義區市府路1號'));
        globals_1.expect(result.status).toBe(200);
    }));
});
globals_1.describe("busker repo test(getAllPerformanceTime)", () => {
    let memberArr = [];
    let buskerArr = [];
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < 3; i++) {
            let memberData = yield memberRepo.generateDiffMemberMockData();
            memberData = yield memberRepo.createMember(memberData);
            memberArr.push(memberData);
            let buskerData = buskerRepo.generateDiffMockData(memberData.id);
            buskerData = yield buskerRepo.createBusker(buskerData);
            buskerArr.push(buskerData);
        }
        const time = buskerRepo.getCurrentTime();
        let year = time.year;
        let month = time.month;
        let date = time.date;
        let hour = time.hour;
        let minute = time.minute;
        for (let i = 0; i < buskerArr.length; i++) {
            const performanceData = buskerRepo.generateDiffPerformanceData(buskerArr[i].id, buskerRepo.setCurrentData(year, month, date, hour, minute));
            if (i >= 1) {
                date++;
                hour++;
            }
            minute = Math.random() * 60;
            yield buskerRepo.applyMockPerformance(performanceData);
        }
    }));
    it("Test get all Performance time :it should be return 200 if use correct  format", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield buskerRepo.getAllPerformanceTime();
        globals_1.expect(result.status).toBe(200);
    }));
});
globals_1.describe("busker repo test(getPerformances)", () => {
    let memberArr = [];
    let buskerArr = [];
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < 1; i++) {
            let memberData = yield memberRepo.generateDiffMemberMockData();
            memberData = yield memberRepo.createMember(memberData);
            memberArr.push(memberData);
            let buskerData = buskerRepo.generateDiffMockData(memberData.id);
            buskerData = yield buskerRepo.createBusker(buskerData);
            buskerArr.push(buskerData);
        }
        const time = buskerRepo.getCurrentTime();
        let year = time.year;
        let month = time.month;
        let date = time.date;
        let hour = time.hour;
        let minute = time.minute;
        for (let i = 0; i < buskerArr.length; i++) {
            const performanceData = buskerRepo.generateDiffPerformanceData(buskerArr[i].id, buskerRepo.setCurrentData(year, month, date, hour, minute));
            if (i >= 10 && i % 10 == 0) {
                date++;
                hour++;
            }
            minute = Math.random() * 60;
            yield buskerRepo.applyMockPerformance(performanceData);
        }
    }));
    it("Test get Performances :it should be return 200 if use correct  format", () => __awaiter(void 0, void 0, void 0, function* () {
        const time = buskerRepo.getCurrentTime();
        let dateData = buskerRepo.setCurrentData(time.year, time.month, time.date, time.hour, time.minute);
        const result = yield buskerRepo.getPerformances(dateData, 1);
        globals_1.expect(result.status).toBe(200);
    }));
});
//# sourceMappingURL=buskerRepo.test.js.map