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
exports.logout = exports.lineReceipt = exports.lineOrder = exports.init = void 0;
const memberRepo = __importStar(require("../repositories/memberRepo"));
const buskerRepo = __importStar(require("../repositories/buskerRepo"));
const BuskerPerformanceComment_1 = require("../entities/BuskerPerformanceComment");
const linePay_1 = require("../moudles/linePay");
const time_1 = require("../moudles/time");
const init = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield buskerRepo.clear();
        yield memberRepo.clear();
        let memberArr = [];
        let buskerArr = [];
        console.log('start init');
        memberRepo.setMockMemberCount(0);
        for (let i = 0; i < 2; i++) {
            let memberData = yield memberRepo.generateDiffMemberMockData();
            memberData = yield memberRepo.createMember(memberData);
            memberArr.push(memberData);
            let buskerData = buskerRepo.generateDiffMockData(memberData.id);
            buskerData = yield buskerRepo.createBusker(buskerData);
            buskerArr.push(buskerData);
        }
        const curTimeStr = time_1.getCurrentFullTimeStr();
        let month = 0;
        let date = 0;
        let hour = 0;
        let minute = 0;
        for (let i = 0; i < buskerArr.length; i++) {
            for (let j = 0; j < 10; j++) {
                const futurePerformanceMockData = buskerRepo.generateDiffPerformanceData(buskerArr[i].id, time_1.addDay(curTimeStr, date + j));
                const futurePerformanceResponse = yield buskerRepo.applyPerformance(buskerArr[i].memberId, futurePerformanceMockData);
                const performanceMockData = buskerRepo.generateDiffPerformanceData(buskerArr[i].id, time_1.addDay(curTimeStr, date - j));
                if (j >= 10 && j % 10 == 0) {
                    date++;
                    hour++;
                }
                minute = Math.random() * 60;
                const performanceResponse = yield buskerRepo.applyPerformance(buskerArr[i].memberId, performanceMockData);
                const performanceData = JSON.parse(performanceResponse.data);
                const memberId = yield buskerRepo.getMemberIdByBuskerId(buskerArr[i].id);
                yield buskerRepo.createPerformanceComment(new BuskerPerformanceComment_1.BuskerPerformanceComment(buskerArr[i].id, performanceData.performanceId, memberId, `comment${j}`, time_1.addDay(curTimeStr, date - j)));
                yield buskerRepo.updateMaxChatroomOnlineAmount(performanceData.performanceId, 1 + j);
            }
        }
        console.log('init done');
        res.status(200).send('sucessful init');
        return;
    }
    catch (error) {
        console.error('error:', error);
    }
    res.status(501).send('fail init');
    res.status(200).send('fail init');
});
exports.init = init;
const lineOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield linePay_1.createBuskerDonateLineOrder(0);
    res.status(200).send('line pay:order');
});
exports.lineOrder = lineOrder;
const lineReceipt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('lineReceipt:', req.query);
    res.redirect('http://localhost:3000/home?q=123456789');
});
exports.lineReceipt = lineReceipt;
// export const apply = async (req: Request, res: Response) => {
//     try {
//         const encryptData = req.body.encryptData
//         const data = decrypt(encryptData)
//         const member = plainToClass(Busker, JSON.parse(data))
//         const errors = await validate(member, { skipMissingProperties: true })
//         if (errors.length > 0) {
//             // console.error(errors);
//             res.status(400).send(`parameter error`);
//             return;
//         } else {
//             const result = await buskerRepo.apply(member)
//             if (result.status == 200 || result.status == 401) {
//                 res.status(result.status).send(result.data)
//             }
//             else {
//                 res.status(500).send('server is busying')
//             }
//         }
//     } catch (error) {
//         console.error('api enroll error:', error);
//     }
// }
const logout = (req, res) => {
    try {
        req.session.destroy(() => {
            console.log('session destroyed');
        });
        res.status(200).send('');
    }
    catch (error) {
        console.error('api logout error:', error);
    }
};
exports.logout = logout;
//# sourceMappingURL=systemController.js.map