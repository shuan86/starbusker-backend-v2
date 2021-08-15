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
exports.clear = exports.getIdByMemberId = exports.isBuskerByMemberId = exports.applyMockPerformance = exports.applyPerformance = exports.getAllPerformanceTime = exports.getPerformances = exports.createBusker = exports.enroll = exports.generateDiffPerformanceData = exports.setCurrentData = exports.getCurrentTime = exports.getCurrentDate = exports.generateDiffMockData = exports.generateFixedMockData = exports.generateApplyPerformance = exports.generatePerformance = exports.generateEnrollBusker = void 0;
const Busker_1 = require("../entities/Busker");
const BuskerPerformance_1 = require("../entities/BuskerPerformance");
const databaseRepo_1 = require("./databaseRepo");
const buskerPerformance_1 = require("../mock/buskerPerformance");
const nodeGeocoder_1 = require("../moudles/nodeGeocoder");
let mockCount = 0;
const generateEnrollBusker = (description, type) => {
    const data = new Busker_1.EnrollBuskerType(description, type);
    return data;
};
exports.generateEnrollBusker = generateEnrollBusker;
const generatePerformance = (buskerId, title, description, time, location, lineMoney = 0, latitude = 0, longitude = 0) => {
    const data = {
        id: 0, buskerId, title, description,
        time, lineMoney, latitude, longitude, location, busker: null
    };
    return data;
};
exports.generatePerformance = generatePerformance;
//front end format
const generateApplyPerformance = (tile, description, time, location) => {
    const data = new BuskerPerformance_1.ApplyPerformanceType(tile, description, time, location);
    return data;
};
exports.generateApplyPerformance = generateApplyPerformance;
const generateFixedMockData = (memberId) => {
    // const mockData = { id: 0, memberId: memberId, type: BuskerKind.singer, description: `description` }
    // const mockMember = Object.assign(new Busker(), mockData)
    // return mockMember
    const mockData = {
        id: 0, memberId: memberId, type: Busker_1.BuskerKind.singer,
        description: `description`, member: null, performances: []
    };
    return Object.assign({}, mockData);
};
exports.generateFixedMockData = generateFixedMockData;
const generateDiffMockData = (memberId) => {
    // const mockData = { id: 0, memberId: memberId, kind: BuskerKind.singer, description: `description${mockCount}` }
    // const mockMember = Object.assign(new Busker(), mockData)
    const mockData = {
        id: 0, memberId: memberId, type: Busker_1.BuskerKind.singer,
        description: `description${mockCount}`, member: null, performances: []
    };
    mockCount++;
    return mockData;
};
exports.generateDiffMockData = generateDiffMockData;
const getCurrentDate = () => {
    const dateOBJ = new Date();
    const currDateOBJ = new Date();
    currDateOBJ.setFullYear(dateOBJ.getUTCFullYear());
    currDateOBJ.setMonth(dateOBJ.getUTCMonth());
    currDateOBJ.setDate(dateOBJ.getUTCDate());
    currDateOBJ.setHours(dateOBJ.getUTCHours());
    currDateOBJ.setMinutes(dateOBJ.getUTCMinutes());
    currDateOBJ.setSeconds(dateOBJ.getUTCSeconds());
    return currDateOBJ;
};
exports.getCurrentDate = getCurrentDate;
const getCurrentTime = () => {
    const dateOBJ = new Date();
    const data = dateOBJ.getUTCFullYear() + '-' +
        ('00' + (dateOBJ.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + dateOBJ.getUTCDate()).slice(-2) + ' ' +
        ('00' + dateOBJ.getUTCHours()).slice(-2) + ':' +
        ('00' + dateOBJ.getUTCMinutes()).slice(-2) + ':' +
        ('00' + dateOBJ.getUTCSeconds()).slice(-2);
    return {
        year: dateOBJ.getUTCFullYear(),
        month: dateOBJ.getUTCMonth(),
        date: dateOBJ.getUTCDate(),
        hour: dateOBJ.getUTCHours(),
        minute: dateOBJ.getUTCMinutes(),
        second: dateOBJ.getUTCMinutes(),
        allStr: data
    };
};
exports.getCurrentTime = getCurrentTime;
const dateToDbDate = (date) => {
    const data = date.getFullYear() + '-' +
        ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' +
        ('00' + date.getHours()).slice(-2) + ':' +
        ('00' + date.getMinutes()).slice(-2) + ':' +
        ('00' + date.getSeconds()).slice(-2);
    return data;
};
const setCurrentData = (year, month, date, hour = 0, minute = 0, second = 0) => {
    const dateOBJ = new Date();
    dateOBJ.setFullYear(year);
    dateOBJ.setMonth(month);
    dateOBJ.setDate(date);
    dateOBJ.setHours(hour);
    dateOBJ.setMinutes(minute);
    dateOBJ.setSeconds(second);
    return dateOBJ;
};
exports.setCurrentData = setCurrentData;
const generateDiffPerformanceData = (buskerId, time) => {
    let count = mockCount;
    if (mockCount > buskerPerformance_1.locationArr.length - 1) {
        count = Math.floor(buskerPerformance_1.locationArr.length - 1 % count);
    }
    const mockData = {
        id: 0, buskerId, title: `title${mockCount}`,
        description: `description${mockCount}`,
        time: time,
        lineMoney: 0,
        latitude: buskerPerformance_1.locationArr[count].latitude,
        longitude: buskerPerformance_1.locationArr[count].longtiude,
        location: buskerPerformance_1.locationArr[count].location,
        busker: null
    };
    mockCount++;
    return Object.assign({}, mockData);
};
exports.generateDiffPerformanceData = generateDiffPerformanceData;
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
            return yield buskerRepo.save(buskerRepo.create(data));
        }
    }
    catch (error) {
        console.error('createBusker:', error);
        return null;
    }
});
exports.createBusker = createBusker;
const getPerformances = (time, page) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    const perItem = 10;
    try {
        const buskerPerformanceRepo = databaseRepo_1.getBuskerPerformanceRepo();
        time.setHours(0);
        time.setMinutes(0);
        time.setSeconds(0);
        const nextDate = exports.setCurrentData(time.getFullYear(), time.getMonth(), time.getDate() + 1, 23, 59);
        const dataArrr = yield buskerPerformanceRepo.createQueryBuilder('p')
            .select(['p.title', 'p.description', 'p.time', 'p.lineMoney', 'p.latitude', 'p.longitude'])
            .where("p.time BETWEEN '" + dateToDbDate(time) + "' AND '" + dateToDbDate(nextDate) + "'")
            .skip((page - 1) * perItem).take(perItem)
            .getManyAndCount();
        repoData.status = 200;
        repoData.data = JSON.stringify(dataArrr);
        return repoData;
    }
    catch (error) {
        console.error('apply error:', error);
        return repoData;
    }
});
exports.getPerformances = getPerformances;
const getAllPerformanceTime = () => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const buskerPerformanceRepo = databaseRepo_1.getBuskerPerformanceRepo();
        const dataArr = yield buskerPerformanceRepo.createQueryBuilder("p")
            .select(['p.time'])
            .groupBy("Day(p.time)").getMany();
        repoData.status = 200;
        repoData.data = JSON.stringify(dataArr);
        return repoData;
    }
    catch (error) {
        console.error('getAllPerformanceTime error:', error);
        return repoData;
    }
});
exports.getAllPerformanceTime = getAllPerformanceTime;
const applyPerformance = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const repo = databaseRepo_1.getBuskerPerformanceRepo();
        // const isPerformanceExist: BuskerPerformance = await repo.findOne({ id: data.buskerId })
        const geocode = yield nodeGeocoder_1.geocoder.geocode(data.location);
        data.latitude = geocode[0].latitude;
        data.longitude = geocode[0].longitude;
        yield repo.save(repo.create(data));
        repoData.status = 200;
        repoData.data = '';
        return repoData;
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