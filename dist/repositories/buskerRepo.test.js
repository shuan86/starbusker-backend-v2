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
const BuskerPerformanceComment_1 = require("../entities/BuskerPerformanceComment");
const globals_1 = require("@jest/globals");
const time_1 = require("../moudles/time");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield mockDbTestConnection_1.mockConnection.create();
    console.log("beforeAll Has connected to DB? ", connection.isConnected);
}));
let memberData;
let buskerData;
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    //create member
    yield mockDbTestConnection_1.mockConnection.clearAllRepo();
    memberData = yield memberRepo.generateDiffMemberMockData();
    memberData = yield memberRepo.createMember(Object.assign({}, memberData));
    buskerData = buskerRepo.generateFixedMockData(memberData.id);
    // buskerData = await buskerRepo.createBusker({ ...buskerData })
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mockDbTestConnection_1.mockConnection.close();
}));
globals_1.describe("busker repo test(enroll)", () => {
    globals_1.test("Test enroll and isBuskerByMemberId:it should be return 200 if use correct member id", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield buskerRepo.enroll(Object.assign({}, buskerData));
        globals_1.expect(result.status).toBe(200);
    }));
    globals_1.test("Test enroll:it should be return 200 if repeat enroll", () => __awaiter(void 0, void 0, void 0, function* () {
        const result1 = yield buskerRepo.enroll(Object.assign({}, buskerData));
        globals_1.expect(result1.status).toBe(200);
    }));
});
globals_1.describe("busker repo test(applyPerformance)", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        buskerData = yield buskerRepo.createBusker(Object.assign({}, buskerData));
    }));
    it("Test apply:it should be return 200 if use correct  format", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield buskerRepo.applyPerformance(buskerRepo.generatePerformance(buskerData.id, 'mockTitle', 'mockDecscription', time_1.getCurrentFullTimeStr(), '110台北市信義區市府路1號'));
        globals_1.expect(result.status).toBe(200);
    }));
});
globals_1.describe("busker repo test(isPerformanceExist)", () => {
    let performanceData;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        buskerData = yield buskerRepo.createBusker(Object.assign({}, buskerData));
        const result = yield buskerRepo.applyPerformance(buskerRepo.generatePerformance(buskerData.id, 'mockTitle', 'mockDecscription', time_1.getCurrentFullTimeStr(), '110台北市信義區市府路1號'));
        performanceData = JSON.parse(result.data);
    }));
    it("Test isPerformanceExist:it should be return true if use correct perforance id", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield buskerRepo.isPerformanceExist(performanceData.performanceId);
        globals_1.expect(result).toBe(true);
    }));
    it("Test isPerformanceExist:it should be return false if use incorrect perforance id", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield buskerRepo.isPerformanceExist(-1);
        globals_1.expect(result).toBe(false);
    }));
});
globals_1.describe("busker repo test(deletePerformance)", () => {
    let performanceData;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        buskerData = yield buskerRepo.createBusker(Object.assign({}, buskerData));
        const reponse = yield buskerRepo.applyPerformance(buskerRepo.generatePerformance(buskerData.id, 'mockTitle', 'mockDecscription', time_1.getCurrentFullTimeStr(), '110台北市信義區市府路1號'));
        performanceData = JSON.parse(reponse.data);
    }));
    it("Test delete:it should be return 200 if use correct perforance id", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield buskerRepo.deletePerformance(performanceData.performanceId);
        globals_1.expect(result.status).toBe(200);
        const isPerformanceExist = yield buskerRepo.isPerformanceExist(performanceData.performanceId);
        globals_1.expect(isPerformanceExist).toBe(false);
    }));
    it("Test delete:it should be return 401 if use incorrect perforance id", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield buskerRepo.deletePerformance(-1);
        globals_1.expect(result.status).toBe(401);
    }));
});
globals_1.describe("busker repo test(getAllPerformanceTime)", () => {
    let memberArr = [];
    let buskerArr = [];
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        for (let i = 0; i < 3; i++) {
            memberData = yield memberRepo.generateDiffMemberMockData();
            memberData = yield memberRepo.createMember(memberData);
            memberArr.push(memberData);
            let buskerData = buskerRepo.generateDiffMockData(memberData.id);
            buskerData = yield buskerRepo.createBusker(buskerData);
            buskerArr.push(buskerData);
        }
        const timeStr = time_1.getCurrentFullTimeStr();
        for (let i = 0; i < buskerArr.length; i++) {
            const performanceData = buskerRepo.generateDiffPerformanceData(buskerArr[i].id, time_1.addTime(timeStr, 0, i, i));
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
            memberData = yield memberRepo.generateDiffMemberMockData();
            memberData = yield memberRepo.createMember(memberData);
            memberArr.push(memberData);
            let buskerData = buskerRepo.generateDiffMockData(memberData.id);
            buskerData = yield buskerRepo.createBusker(buskerData);
            buskerArr.push(buskerData);
        }
        const timeStr = time_1.getCurrentFullTimeStr();
        let date = 0;
        let hour = 0;
        let minute = 0;
        for (let i = 0; i < buskerArr.length; i++) {
            const performanceData = buskerRepo.generateDiffPerformanceData(buskerArr[i].id, time_1.addTime(timeStr, 0, date, hour, minute));
            if (i >= 10 && i % 10 == 0) {
                date++;
                hour++;
            }
            minute = Math.random() * 60;
            yield buskerRepo.applyMockPerformance(performanceData);
        }
    }));
    it("Test get Performances :it should be return 200 if use correct  format", () => __awaiter(void 0, void 0, void 0, function* () {
        const timeStr = time_1.getCurrentFullTimeStr();
        const result = yield buskerRepo.getPerformances(timeStr, 1);
        globals_1.expect(result.status).toBe(200);
    }));
});
globals_1.describe("busker repo test(createPerformanceComment)", () => {
    const testStr = 'testStr';
    let performanceData;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        buskerData = yield buskerRepo.createBusker(Object.assign({}, buskerData));
        const result = yield buskerRepo.applyPerformance(buskerRepo.generatePerformance(buskerData.id, 'mockTitle', 'mockDecscription', time_1.getCurrentFullTimeStr(), '110台北市信義區市府路1號'));
        performanceData = JSON.parse(result.data);
    }));
    it("Test createPerformanceComment :it should be return true if use correct  format", () => __awaiter(void 0, void 0, void 0, function* () {
        yield buskerRepo.createPerformanceComment(new BuskerPerformanceComment_1.BuskerPerformanceComment(buskerData.id, performanceData.performanceId, buskerData.memberId, testStr, undefined));
        const result = yield buskerRepo.getPerformanceCommentsByBuskerId(buskerData.id);
        globals_1.expect(result.status).toBe(200);
        const dataArr = JSON.parse(result.data);
        let isFindComment = false;
        for (const data of dataArr) {
            if (data.comment == testStr)
                isFindComment = true;
        }
        globals_1.expect(isFindComment).toBe(true);
    }));
});
globals_1.describe("busker repo test(getTop5MaxOnlineAmount,getTop5NewestMaxCommentAmount,getWeekCommentAmount and getFuturePerformancesData)", () => {
    const testStr = 'testStr';
    let performanceData;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        buskerData = yield buskerRepo.createBusker(Object.assign({}, buskerData));
        const curTimeStr = time_1.getCurrentFullTimeStr();
        for (let i = 0; i < 1; i++) {
            for (let j = 0; j < 7; j++) {
                const futurePerformanceResponse = yield buskerRepo.applyPerformance(buskerRepo.generatePerformance(buskerData.id, 'mockTitle', 'mockDecscription', time_1.addDay(curTimeStr, j), `110台北市信義區市府路${i}號`));
                const performanceResponse = yield buskerRepo.applyPerformance(buskerRepo.generatePerformance(buskerData.id, 'mockTitle', 'mockDecscription', time_1.addDay(curTimeStr, -(j)), `110台北市信義區市府路${i}號`));
                const performanceData = JSON.parse(performanceResponse.data);
                const memberId = yield buskerRepo.getMemberIdByBuskerId(buskerData.id);
                yield buskerRepo.createPerformanceComment(new BuskerPerformanceComment_1.BuskerPerformanceComment(buskerData.id, performanceData.performanceId, memberId, `${i}`, time_1.addDay(curTimeStr, -(j))));
                yield buskerRepo.updateMaxChatroomOnlineAmount(performanceData.performanceId, i);
            }
        }
    }));
    it("Test getTop5MaxOnlineAmount :it should be return 200 if use correct  format", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield buskerRepo.getTop5NewestHighestOnlineAmount(buskerData.id);
        const data = JSON.parse(result.data);
        globals_1.expect(result.status).toBe(200);
    }));
    it("Test getTop5NewestMaxCommentAmount :it should be return 200 if use correct  format", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield buskerRepo.getTop5HighestCommentAmount(buskerData.id);
        const data = JSON.parse(result.data);
        globals_1.expect(result.status).toBe(200);
    }));
    it("Test getWeekCommentAmount :it should be return 200 if use correct  format", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield buskerRepo.getWeekCommentAmount(buskerData.id);
        const data = JSON.parse(result.data);
        globals_1.expect(result.status).toBe(200);
    }));
    it("Test getFuturePerformancesData :it should be return 200 if use correct  format", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield buskerRepo.getFuturePerformancesData(buskerData.id);
        const data = JSON.parse(result.data);
        globals_1.expect(result.status).toBe(200);
    }));
});
//# sourceMappingURL=buskerRepo.test.js.map