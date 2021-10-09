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
exports.clear = exports.getFuturePerformancesData = exports.getWeekCommentAmount = exports.getTop5HighestCommentAmount = exports.getTop5NewestHighestOnlineAmount = exports.getPerformanceCommentsByBuskerId = exports.createPerformanceComment = exports.updateLinePayMoneyByPerformanceId = exports.getMemberIdByBuskerId = exports.getNameBukserIdPerformanceIdByLinePayOrderId = exports.getIdByMemberId = exports.updateMaxChatroomOnlineAmount = exports.getPerformancesDonateByMemberId = exports.getPerformanceInfo = exports.getBuskerInfoByBuskerId = exports.isPerformanceIdExist = exports.isBuskerIdExist = exports.isBuskerByMemberId = exports.applyMockPerformance = exports.deletePerformance = exports.applyPerformance = exports.isPerformanceExist = exports.getAllPerformanceTime = exports.getPerformances = exports.createBusker = exports.enroll = exports.generateDiffPerformanceData = exports.dateToDbDate = exports.getCurrentTime = exports.getCurrentYearMonthDateTimeStr = exports.generateDiffMockData = exports.generateFixedMockData = exports.generatePerformanceComment = exports.generateApplyPerformance = exports.generatePerformance = exports.generateEnrollBusker = void 0;
const Busker_1 = require("../entities/Busker");
const Member_1 = require("../entities/Member");
const BuskerPerformance_1 = require("../entities/BuskerPerformance");
const databaseRepo_1 = require("./databaseRepo");
const buskerPerformance_1 = require("../mock/buskerPerformance");
const BuskerPerformanceComment_1 = require("../entities/BuskerPerformanceComment");
const moment_1 = __importDefault(require("moment"));
require("moment-timezone");
const time_1 = require("../moudles/time");
const memberRepo_1 = require("./memberRepo");
const linePay_1 = require("../moudles/linePay");
let mockCount = 0;
const generateEnrollBusker = (description, type) => {
    const data = new Busker_1.EnrollBuskerType(description, type);
    return data;
};
exports.generateEnrollBusker = generateEnrollBusker;
const generatePerformance = (buskerId, title, description, time, location, lineMoney = 0, latitude = 0, longitude = 0) => {
    const data = new BuskerPerformance_1.BuskerPerformance(buskerId, title, description, time, lineMoney, 0, latitude, longitude, location);
    // const data: BuskerPerformance = {
    //     id: 0, buskerId, title, description
    //     , time, lineMoney, highestOnlineAmount: 0, latitude, longitude, location, busker: undefined, buskerPerformanceComments: undefined
    // }
    return data;
};
exports.generatePerformance = generatePerformance;
//front end format
const generateApplyPerformance = (tile, description, time, location) => {
    const data = new BuskerPerformance_1.ApplyPerformanceType(tile, description, time, location);
    return data;
};
exports.generateApplyPerformance = generateApplyPerformance;
const generatePerformanceComment = (buskerId, performanceId, memberId, comment, time) => {
    const data = new BuskerPerformanceComment_1.BuskerPerformanceComment(buskerId, performanceId, memberId, comment, time);
    return data;
};
exports.generatePerformanceComment = generatePerformanceComment;
const generateFixedMockData = (memberId) => {
    const mockData = new Busker_1.Busker(memberId, Busker_1.BuskerType.singer, `description${mockCount}`, 0);
    return mockData;
};
exports.generateFixedMockData = generateFixedMockData;
const generateDiffMockData = (memberId) => {
    const mockData = new Busker_1.Busker(memberId, Busker_1.BuskerType.singer, `description${mockCount}`, 0);
    mockCount++;
    return mockData;
};
exports.generateDiffMockData = generateDiffMockData;
const getCurrentYearMonthDateTimeStr = () => {
    const dateOBJ = moment_1.default().format('YYYY-MM-DD');
    return dateOBJ;
};
exports.getCurrentYearMonthDateTimeStr = getCurrentYearMonthDateTimeStr;
const parseFullTimeStr = (allStr) => {
    const strArr = allStr.split(' ');
    const yearMonthDateArr = strArr[0].split('-'); //YYYY-MM-DD
    const hourMinuteSecond = strArr[1].split(':'); //HH:mm:ss
    return {
        yearMonthDateStr: strArr[0],
        hourMinuteSecondStr: strArr[1],
        year: Number(yearMonthDateArr[0]),
        month: Number(yearMonthDateArr[1]),
        date: Number(yearMonthDateArr[2]),
        hour: Number(hourMinuteSecond[0]),
        minute: Number(hourMinuteSecond[1]),
        second: Number(hourMinuteSecond[2]),
        allStr: allStr
    };
};
const getCurrentTime = () => {
    const allStr = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
    return Object.assign({}, parseFullTimeStr(allStr));
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
exports.dateToDbDate = dateToDbDate;
const generateDiffPerformanceData = (buskerId, time) => {
    let count = mockCount;
    if (mockCount >= buskerPerformance_1.locationArr.length - 1) {
        count = Math.floor(count % buskerPerformance_1.locationArr.length);
    }
    const mockData = new BuskerPerformance_1.BuskerPerformance(buskerId, `title${mockCount}`, `description${mockCount}`, time, 0, count, buskerPerformance_1.locationArr[count].latitude, buskerPerformance_1.locationArr[count].longtiude, buskerPerformance_1.locationArr[count].location);
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
            const infoData = yield memberRepo_1.getMemberInfoDataById(busker.memberId);
            repoData.data = JSON.stringify(infoData);
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
        const isBuskerExist = yield buskerRepo.findOne({ memberId: data.memberId });
        if (isBuskerExist) {
            return null;
        }
        else {
            const orderReuslt = yield linePay_1.createBuskerDonateLineOrder(data.memberId);
            if (orderReuslt.returnCode == '0000') {
                data.linePayOrderId = orderReuslt.orderId;
                data.linePayTransactionId = orderReuslt.info.transactionId.toString();
                data.linePayOrderUrl = orderReuslt.info.paymentUrl.web;
                return yield buskerRepo.save(buskerRepo.create(data));
            }
            return null;
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
        // time.setHours(0)
        // time.setMinutes(0)
        // time.setSeconds(0)
        const nextDate = time_1.addDay(time, 1);
        // const dataArrr = await buskerPerformanceRepo.createQueryBuilder('p')
        //     .select(['p.id', 'p.title', 'p.description', 'p.time', 'p.lineMoney', 'p.latitude', 'p.longitude'])
        //     .where("p.time BETWEEN '" + dateToDbDate(time) + "' AND '" + dateToDbDate(nextDate) + "'")
        //     .skip((page - 1) * perItem).take(perItem)
        //     .getManyAndCount()
        const dataArr = yield buskerPerformanceRepo.createQueryBuilder('p')
            .select(['m.name name,b.id buskerId', 'p.id performanceId', 'p.title  title', 'p.description description', 'p.time time', 'p.lineMoney lineMoney', 'p.latitude latitude', 'p.longitude longitude', 'p.location location', 'm.avatar avatar'])
            .where("p.time BETWEEN '" + time + "' AND '" + nextDate + "'")
            .innerJoin(Busker_1.Busker, "b", "p.buskerId = b.id")
            .innerJoin(Member_1.Member, "m", "m.id = b.memberId")
            .offset((page - 1) * perItem).limit(perItem)
            .getRawMany();
        for (let i = 0; i < dataArr.length; i++) {
            dataArr[i].avatar = dataArr[i].avatar == null ? '' : Buffer.from(dataArr[i].avatar).toString('base64');
        }
        const dataAmount = yield buskerPerformanceRepo.createQueryBuilder('p')
            .skip((page - 1) * perItem).take(perItem)
            .where("p.time BETWEEN '" + time + "' AND '" + nextDate + "'")
            .leftJoinAndSelect(Busker_1.Busker, "b", "p.buskerId = b.id")
            .leftJoinAndSelect(Member_1.Member, "m", "m.id = b.memberId").getCount();
        repoData.status = 200;
        repoData.data = JSON.stringify({ dataArr, dataAmount });
        // console.log('repoData.data:', repoData.data);
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
            .select(['date(p.time) time'])
            .groupBy("date(p.time)").orderBy("p.time").getRawMany();
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
const isPerformanceExist = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repo = databaseRepo_1.getBuskerPerformanceRepo();
        const result = yield repo.findOne({ id });
        if (result)
            return true;
        return false;
    }
    catch (error) {
        console.error('isPerformanceExist error', error);
    }
});
exports.isPerformanceExist = isPerformanceExist;
const applyPerformance = (memberId, data) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const performanceRepo = databaseRepo_1.getBuskerPerformanceRepo();
        const orderReuslt = yield linePay_1.createBuskerDonateLineOrder(memberId);
        if (orderReuslt.returnCode == '0000') {
            data.linePayOrderId = orderReuslt.orderId;
            data.linePayTransactionId = orderReuslt.info.transactionId.toString();
            data.linePayOrderUrl = orderReuslt.info.paymentUrl.web;
        }
        else {
            repoData.data = 'line error';
            return repoData;
        }
        const performanceResult = yield performanceRepo.save(performanceRepo.create(data));
        if (performanceResult) {
            repoData.status = 200;
            const reponseData = yield performanceRepo.createQueryBuilder('p')
                .select(['p.id performanceId ', 'm.name name', 'm.email email',
                'p.location location', 'p.description description', 'p.title title',
                'p.latitude latitude', 'p.longitude longitude', 'p.time time'
            ])
                .innerJoin(Busker_1.Busker, 'b', `b.id=${performanceResult.buskerId}`)
                .innerJoin(Member_1.Member, 'm', 'm.id=b.memberId')
                .where(`p.id=${performanceResult.id}`)
                .getRawOne();
            repoData.data = JSON.stringify(reponseData);
        }
        else {
            repoData.status = 401;
            repoData.data = '';
        }
        return repoData;
    }
    catch (error) {
        console.error('applyPerformance error:', error);
        return repoData;
    }
});
exports.applyPerformance = applyPerformance;
const deletePerformance = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const performanceRepo = databaseRepo_1.getBuskerPerformanceRepo();
        const performance = yield performanceRepo.findOne({ id });
        if (performance) {
            const result = yield performanceRepo.remove(performance);
            if (result) {
                repoData.status = 200;
                return repoData;
            }
        }
        repoData.status = 401;
        return repoData;
    }
    catch (error) {
        console.error('deletePerformance error:', error);
        return repoData;
    }
});
exports.deletePerformance = deletePerformance;
const applyMockPerformance = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const repo = databaseRepo_1.getBuskerPerformanceRepo();
        yield repo.save(repo.create(data));
        repoData.status = 200;
        repoData.data = '';
        return repoData;
    }
    catch (error) {
        console.error('applyPerformance error:', error);
        return repoData;
    }
});
exports.applyMockPerformance = applyMockPerformance;
const isBuskerByMemberId = (memberId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repo = databaseRepo_1.getBuskerRepo();
        const busker = yield repo.findOne({ memberId });
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
//not test
const isBuskerIdExist = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repo = databaseRepo_1.getBuskerRepo();
        const busker = yield repo.findOne({ id });
        if (busker)
            return true;
        else
            return false;
    }
    catch (error) {
        console.error('isBuskerIdExist:', error);
        return false;
    }
});
exports.isBuskerIdExist = isBuskerIdExist;
const isPerformanceIdExist = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repo = databaseRepo_1.getBuskerPerformanceRepo();
        const performance = yield repo.findOne({ id });
        if (performance)
            return performance;
        else
            return null;
    }
    catch (error) {
        console.error('isBuskerIdExist:', error);
    }
    return null;
});
exports.isPerformanceIdExist = isPerformanceIdExist;
//not test
const getBuskerInfoByBuskerId = (buskerId) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const buskerRepo = databaseRepo_1.getBuskerRepo();
        const data = yield buskerRepo.createQueryBuilder('b')
            .select(['b.description description', 'b.likeAmount  likeAmount', 'b.type type', 'b.linePayOrderUrl linePayOrderUrl', 'm.name name', 'm.avatar avatar'])
            .innerJoin(Member_1.Member, "m", "m.id = b.memberId")
            .where(`b.id=:buskerId`, { buskerId })
            .getRawOne();
        if (data) {
            // repoData.data = {name}
            console.log('data name:', data.name, buskerId);
            data.avatar = data.avatar == null ? '' : Buffer.from(data.avatar).toString('base64');
            repoData.status = 200;
            repoData.data = JSON.stringify(data);
        }
        else {
            repoData.status = 401;
        }
        return repoData;
    }
    catch (error) {
        console.error('getBuskerInfoByBuskerId:', error);
        return repoData;
    }
});
exports.getBuskerInfoByBuskerId = getBuskerInfoByBuskerId;
const getPerformanceInfo = (performanceId) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const performanceRepo = databaseRepo_1.getBuskerPerformanceRepo();
        const data = yield performanceRepo.createQueryBuilder('p')
            .select(['b.description description', 'b.likeAmount  likeAmount',
            'b.type type', 'p.linePayOrderUrl linePayOrderUrl', 'm.name name', 'm.avatar avatar'])
            .where(`p.id=:performanceId`, { performanceId })
            .innerJoin(Busker_1.Busker, "b", `b.id=p.buskerId`)
            .innerJoin(Member_1.Member, "m", "m.id = b.memberId")
            .getRawOne();
        if (data) {
            data.avatar = data.avatar == null ? '' : Buffer.from(data.avatar).toString('base64');
            repoData.status = 200;
            repoData.data = JSON.stringify(data);
        }
        else {
            repoData.status = 401;
        }
        return repoData;
    }
    catch (error) {
        console.error('getPerformanceInfo:', error);
        return repoData;
    }
});
exports.getPerformanceInfo = getPerformanceInfo;
const getPerformancesDonateByMemberId = (memberId) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const memberRepo = databaseRepo_1.getMemberRepos();
        const data = yield memberRepo.createQueryBuilder('m')
            .select(['sum(p.lineMoney) amount'])
            .innerJoin(Busker_1.Busker, 'b', `b.memberId=m.id and m.id=:memberId`, { memberId })
            .innerJoin(BuskerPerformance_1.BuskerPerformance, 'p', `p.buskerId=b.id`)
            .groupBy('p.buskerId')
            .getRawOne();
        if (data) {
            repoData.status = 200;
            repoData.data = JSON.stringify(data);
        }
        else {
            repoData.status = 401;
        }
        return repoData;
    }
    catch (error) {
        console.error('getPerformancesDonate:', error);
        return repoData;
    }
});
exports.getPerformancesDonateByMemberId = getPerformancesDonateByMemberId;
//not test
const updateMaxChatroomOnlineAmount = (performanceId, onlineAmount) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const performanceRepo = databaseRepo_1.getBuskerPerformanceRepo();
        const performance = yield performanceRepo.findOne({ id: performanceId });
        if (onlineAmount > performance.highestOnlineAmount) {
            yield performanceRepo.update({ id: performanceId }, { highestOnlineAmount: onlineAmount });
            return true;
        }
        return false;
    }
    catch (error) {
        console.error('saveChatroomClientAmount:', error);
        return false;
    }
});
exports.updateMaxChatroomOnlineAmount = updateMaxChatroomOnlineAmount;
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
const getNameBukserIdPerformanceIdByLinePayOrderId = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const performanceRepo = databaseRepo_1.getBuskerPerformanceRepo();
        const data = yield performanceRepo.createQueryBuilder('p')
            .select(['p.id performanceId', 'p.buskerId buskerId', 'm.name name'])
            .where(`p.linePayOrderId=:orderId`, { orderId: orderId })
            .innerJoin(Busker_1.Busker, 'b', `b.id = p.buskerId`)
            .innerJoin(Member_1.Member, 'm', `m.id = b.memberId`)
            .getRawOne();
        if (data)
            return { name: data.name, performanceId: data.performanceId, buskerId: data.buskerId };
        else
            return null;
    }
    catch (error) {
        console.error('getNameBukserIdPerformanceIdByLinePayOrderId:', error);
    }
});
exports.getNameBukserIdPerformanceIdByLinePayOrderId = getNameBukserIdPerformanceIdByLinePayOrderId;
const getMemberIdByBuskerId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repo = databaseRepo_1.getBuskerRepo();
        const busker = yield repo.findOne({ id: id });
        if (busker)
            return busker.memberId;
        else
            return null;
    }
    catch (error) {
        console.error('getIdByMemberId:', error);
    }
});
exports.getMemberIdByBuskerId = getMemberIdByBuskerId;
const updateLinePayMoneyByPerformanceId = (performanceId, money) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const performanceRepo = databaseRepo_1.getBuskerPerformanceRepo();
        const performance = yield performanceRepo.findOne({ id: performanceId });
        if (performance) {
            const result = yield performanceRepo.update(performanceId, { lineMoney: performance.lineMoney + money });
            console.log('updateLinePayMoneyBy PerformanceId:', performanceId, performance.lineMoney, money);
            if (result)
                return true;
        }
        return false;
    }
    catch (error) {
        console.error('updateLinePayMoneyByPerformanceId:', error);
        return false;
    }
});
exports.updateLinePayMoneyByPerformanceId = updateLinePayMoneyByPerformanceId;
const createPerformanceComment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentRepo = databaseRepo_1.getBuskerPerformanceCommentRepo();
        const result = yield commentRepo.save(commentRepo.create(data));
        if (result) {
            return true;
        }
    }
    catch (error) {
        console.error('createPerformanceComment:', error);
    }
    return false;
});
exports.createPerformanceComment = createPerformanceComment;
const getPerformanceCommentsByBuskerId = (buskerId) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const commentRepo = databaseRepo_1.getBuskerPerformanceCommentRepo();
        const result = yield commentRepo.createQueryBuilder('c')
            .select(['m.account account', 'c.comment comment', 'c.time time'])
            .where(`c.buskerId=${buskerId}`)
            .innerJoin(Member_1.Member, 'm', `m.id=c.memberId`)
            .getRawMany();
        if (result) {
            // repoData.data = JSON.stringify({ dataArr: result })
            repoData.data = JSON.stringify(result);
            repoData.status = 200;
        }
        else {
            repoData.status = 401;
        }
        return repoData;
    }
    catch (error) {
        console.error('getPerformanceCommentByBuskerId:', error);
        return repoData;
    }
});
exports.getPerformanceCommentsByBuskerId = getPerformanceCommentsByBuskerId;
const getTop5NewestHighestOnlineAmount = (buskerId) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const performanceRepo = databaseRepo_1.getBuskerPerformanceRepo();
        // const result = await performanceRepo.find({select:['time'],where:{buskerId},group,order:{time:'DESC'}})
        const result = yield performanceRepo.createQueryBuilder('p')
            .select(['p.highestOnlineAmount highestOnlineAmount', 'p.time time'])
            .where(`p.buskerId=${buskerId}`).orderBy('p.highestOnlineAmount', 'DESC').skip(0).take(5).getRawMany();
        if (result) {
            // repoData.data = JSON.stringify({ dataArr: result })
            repoData.data = JSON.stringify(result);
            repoData.status = 200;
        }
        else {
            repoData.status = 401;
        }
        return repoData;
    }
    catch (error) {
        console.error('getTop5MaxOnlineAmount:', error);
    }
    return repoData;
});
exports.getTop5NewestHighestOnlineAmount = getTop5NewestHighestOnlineAmount;
const getTop5HighestCommentAmount = (buskerId) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const commentRepo = databaseRepo_1.getBuskerPerformanceCommentRepo();
        // const result = await performanceRepo.find({select:['time'],where:{buskerId},group,order:{time:'DESC'}})
        const result = yield commentRepo.createQueryBuilder('c')
            .select(['count(c.time) count', "DATE_FORMAT(c.time,'%Y/%m/%d') time"])
            .where(`c.buskerId=${buskerId}`).orderBy('c.time', 'DESC').groupBy('Date(c.time)').skip(0).take(5).getRawMany();
        if (result) {
            repoData.data = JSON.stringify(result);
            repoData.status = 200;
        }
        else {
            repoData.status = 401;
        }
        return repoData;
    }
    catch (error) {
        console.error('getTop5MaxOnlineAmount:', error);
    }
    return repoData;
});
exports.getTop5HighestCommentAmount = getTop5HighestCommentAmount;
const getWeekCommentAmount = (buskerId) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const commentRepo = databaseRepo_1.getBuskerPerformanceCommentRepo();
        const curTime = exports.getCurrentYearMonthDateTimeStr();
        const sevenDaysAgo = time_1.addDayReturnYearMonthDate(curTime, -7);
        const result = yield commentRepo.createQueryBuilder('c') //FrontEndWeekCommentAmountType[]
            .select(['count(c.time) count', "DATE_FORMAT(c.time,'%Y/%m/%d') time"])
            .andWhere(`c.buskerId = ${buskerId}`)
            .andWhere('c.time > :sevenDaysAgo', { sevenDaysAgo: sevenDaysAgo })
            .andWhere('c.time <= :curTime', { curTime: curTime })
            .groupBy('date(c.time)')
            .orderBy('c.time', 'DESC')
            .getRawMany();
        if (result) {
            repoData.data = JSON.stringify(result);
            repoData.status = 200;
        }
        else {
            repoData.status = 401;
        }
        return repoData;
    }
    catch (error) {
        console.error('getWeekCommentAmount:', error);
    }
    return repoData;
});
exports.getWeekCommentAmount = getWeekCommentAmount;
const getFuturePerformancesData = (buskerId) => __awaiter(void 0, void 0, void 0, function* () {
    let repoData = { status: 501, data: '' };
    try {
        const performaceRepo = databaseRepo_1.getBuskerPerformanceRepo();
        const curTime = exports.getCurrentYearMonthDateTimeStr();
        const result = yield performaceRepo.createQueryBuilder('p') //FrontEndWeekCommentAmountType[]
            .select(['p.id performanceId', 'p.title title', 'p.location location', "DATE_FORMAT(p.time,'%Y/%m/%d %T') time",
            'p.description description', 'p.latitude latitude', 'p.longitude longitude',
            'm.name name', 'm.email email',
        ])
            .innerJoin(Busker_1.Busker, 'b', `b.id=${buskerId}`)
            .innerJoin(Member_1.Member, 'm', 'm.id=b.memberId')
            .andWhere(`p.buskerId=${buskerId}`)
            .andWhere('p.time >= :curTime', { curTime: curTime })
            .orderBy('p.time', 'ASC')
            .getRawMany();
        if (result) {
            repoData.data = JSON.stringify(result);
            repoData.status = 200;
        }
        else {
            repoData.status = 401;
        }
        return repoData;
    }
    catch (error) {
        console.error('getFuturePerformancesData:', error);
    }
    return repoData;
});
exports.getFuturePerformancesData = getFuturePerformancesData;
// export const getIdByMemberId = async (id: number): Promise<number> => {
//     try {
//         const repo = getBuskerRepo()
//         const busker = await repo.findOne({ memberId: id })
//         if (busker)
//             return busker.id
//         else
//             return null
//     } catch (error) {
//         console.error('getIdByMemberId:', error);
//     }
// }
const clear = () => __awaiter(void 0, void 0, void 0, function* () {
    const buskerRepo = databaseRepo_1.getBuskerRepo();
    const buskerPerformanceRepo = databaseRepo_1.getBuskerPerformanceRepo();
    const preformanceRepo = databaseRepo_1.getBuskerPerformanceRepo();
    const preformanceCommentRepo = databaseRepo_1.getBuskerPerformanceCommentRepo();
    const comments = yield preformanceCommentRepo.find();
    const preformances = yield preformanceRepo.find();
    const buskers = yield buskerRepo.find();
    for (const c of comments) {
        yield preformanceCommentRepo.remove(c);
    }
    for (const p of preformances) {
        yield buskerPerformanceRepo.remove(p);
    }
    for (const b of buskers) {
        yield buskerRepo.remove(b);
    }
});
exports.clear = clear;
//# sourceMappingURL=buskerRepo.js.map