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
exports.clear = exports.getIdByMemberId = exports.isBuskerByMemberId = exports.applyMockPerformance = exports.applyPerformance = exports.createBusker = exports.enroll = exports.generateDiffPerformanceMockData = exports.getCurrentData = exports.generateDiffMockData = exports.generateFixedMockData = void 0;
const Busker_1 = require("../entities/Busker");
const databaseRepo_1 = require("./databaseRepo");
const buskerPerformance_1 = require("../mock/buskerPerformance");
let mockCount = 0;
const generateFixedMockData = (memberId) => {
    const mockData = { id: 0, memberId: memberId, kind: Busker_1.BuskerKind.singer, description: `description` };
    const mockMember = Object.assign(new Busker_1.Busker(), mockData);
    return mockMember;
};
exports.generateFixedMockData = generateFixedMockData;
const generateDiffMockData = (memberId) => {
    const mockData = { id: 0, memberId: memberId, kind: Busker_1.BuskerKind.singer, description: `description${mockCount}` };
    const mockMember = Object.assign(new Busker_1.Busker(), mockData);
    mockCount++;
    return mockMember;
};
exports.generateDiffMockData = generateDiffMockData;
const getCurrentData = () => {
    const date = new Date();
    const data = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);
    return data;
};
exports.getCurrentData = getCurrentData;
const generateDiffPerformanceMockData = (buskerId) => {
    let count = mockCount;
    if (mockCount > buskerPerformance_1.locationArr.length) {
        count = Math.floor(buskerPerformance_1.locationArr.length % count);
    }
    const mockData = {
        id: 0, buskerId, title: `title${mockCount}`,
        description: `description${mockCount}`,
        time: exports.getCurrentData(),
        lineMoney: 0,
        latitude: buskerPerformance_1.locationArr[count].latitude,
        longitude: buskerPerformance_1.locationArr[count].longtiude,
        location: buskerPerformance_1.locationArr[count].location,
        busker: null
    };
    mockCount++;
    return Object.assign({}, mockData);
};
exports.generateDiffPerformanceMockData = generateDiffPerformanceMockData;
const enroll = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const busker = yield exports.createBusker(data);
        if (busker == null) {
            repoData.data = 'enroll fail:memberExist';
            repoData.status = 401;
        }
        else {
            repoData.status = 200;
            repoData.data = 'enroll suessful';
        }
        return repoData;
    }
    catch (error) {
        console.error('error enroll fail:', error);
        return repoData;
    }
});
exports.enroll = enroll;
const createBusker = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const buskerRepo = databaseRepo_1.getBuskerRepo();
        const busker = yield buskerRepo.findOne({ memberId: data.memberId });
        if (busker) {
            return null;
        }
        else {
            return yield buskerRepo.save(data);
        }
    }
    catch (error) {
        console.error('createMember:', error);
        return null;
    }
});
exports.createBusker = createBusker;
const applyPerformance = (buskerId, data) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const repo = databaseRepo_1.getBuskerPerformanceRepo();
        const isPerformanceExist = yield repo.findOne({ id: buskerId });
        yield repo.save(Object.assign({}, data));
        repoData.status = 200;
        repoData.data = '';
        return repoData;
        // if (isPerformanceExist) {
        //     await repo.save({ ...data })
        //     repoData.status = 200
        //     repoData.data = ''
        //     return repoData
        // }
        // else {
        //     repoData.data = 'failed to apply'
        //     repoData.status = 401
        //     return repoData
        // }
    }
    catch (error) {
        console.error('apply error:', error);
        return repoData;
    }
});
exports.applyPerformance = applyPerformance;
const applyMockPerformance = (buskerId, data) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const repo = databaseRepo_1.getBuskerPerformanceRepo();
        const isPerformanceExist = yield repo.findOne({ id: buskerId });
        if (isPerformanceExist) {
            yield repo.save(Object.assign({}, data));
            repoData.status = 200;
            repoData.data = '';
            return repoData;
        }
        else {
            yield repo.save(Object.assign({}, data));
            repoData.status = 200;
            repoData.data = '';
            return repoData;
        }
    }
    catch (error) {
        console.error('apply error:', error);
        return repoData;
    }
});
exports.applyMockPerformance = applyMockPerformance;
const isBuskerByMemberId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repo = databaseRepo_1.getBuskerRepo();
        const busker = yield repo.findOne({ id });
        if (busker)
            return true;
        else
            return false;
    }
    catch (error) {
        console.error('isBuskerByMemberId:', error);
        return false;
    }
});
exports.isBuskerByMemberId = isBuskerByMemberId;
const getIdByMemberId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repo = databaseRepo_1.getBuskerRepo();
        const busker = yield repo.findOne({ memberId: id });
        if (busker)
            return busker.id;
        else
            return null;
    }
    catch (error) {
        console.error('getIdByMemberId:', error);
    }
});
exports.getIdByMemberId = getIdByMemberId;
const clear = () => __awaiter(void 0, void 0, void 0, function* () {
    const buskerRepo = databaseRepo_1.getBuskerRepo();
    const buskerPerformanceRepo = databaseRepo_1.getBuskerPerformanceRepo();
    const preformanceRepo = databaseRepo_1.getBuskerPerformanceRepo();
    const preformances = yield preformanceRepo.find();
    const buskers = yield buskerRepo.find();
    for (const p of preformances) {
        yield buskerPerformanceRepo.remove(p);
    }
    for (const b of buskers) {
        yield buskerRepo.remove(b);
    }
});
exports.clear = clear;
//# sourceMappingURL=buskerRepo.js.map