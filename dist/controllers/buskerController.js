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
exports.getFuturePerformancesData = exports.getWeekCommentAmount = exports.getCommentAmount = exports.getOnlineAmount = exports.deletePerformance = exports.getAllPerformanceTime = exports.applyPerformance = exports.getPerformances = exports.enroll = exports.getBusker = void 0;
const Busker_1 = require("../entities/Busker");
const BuskerPerformance_1 = require("../entities/BuskerPerformance");
const buskerRepo = __importStar(require("../repositories/buskerRepo"));
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const time_1 = require("../moudles/time");
const getBusker = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.query.data;
        const buskerId = class_transformer_1.plainToClass(Busker_1.GetBuskerType, JSON.parse(data));
        const errors = yield class_validator_1.validate(buskerId, { skipMissingProperties: true });
        if (errors.length > 0) {
            // console.error(errors);
            res.status(400).send(`parameter error`);
            return;
        }
        else {
            const result = yield buskerRepo.getBuskerInfoByBuskerId(buskerId.id);
            if (result.status == 200 || result.status == 401) {
                res.status(result.status).send(result.data);
            }
            else {
                res.status(500).send('server is busying');
            }
        }
    }
    catch (error) {
        console.error('api getBusker  error:', error);
    }
});
exports.getBusker = getBusker;
const enroll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body.data;
        const busker = class_transformer_1.plainToClass(Busker_1.Busker, JSON.parse(data));
        const errors = yield class_validator_1.validate(busker, { skipMissingProperties: true });
        if (errors.length > 0) {
            // console.error(errors);
            res.status(400).send(`parameter error`);
            return;
        }
        else {
            const memberId = req.user;
            busker.memberId = memberId;
            const result = yield buskerRepo.enroll(busker);
            console.log('busker enroll:', result);
            if (result.status == 200 || result.status == 401) {
                res.status(result.status).send(result.data);
            }
            else {
                res.status(500).send('server is busying');
            }
        }
    }
    catch (error) {
        console.error('api enroll error:', error);
    }
});
exports.enroll = enroll;
const getPerformances = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.query.data;
        const performance = class_transformer_1.plainToClass(BuskerPerformance_1.GetPerformancesType, JSON.parse(data));
        const errors = yield class_validator_1.validate(performance);
        if (errors.length > 0) {
            // console.error(errors);
            res.status(400).send(`parameter error`);
            return;
        }
        else {
            // if (performance.time.includes('-') == false) {
            // }
            const timeArr = performance.time.split('-');
            if (timeArr.length < 3) {
                res.status(400).send(`time parameter error`);
                return;
            }
            const year = Number(timeArr[0]);
            const month = Number(timeArr[1]);
            const date = Number(timeArr[2]);
            if (year == NaN || month == NaN || date == NaN) {
                res.status(400).send(`time parameter error`);
                return;
            }
            const result = yield buskerRepo.getPerformances(time_1.setDate(year, month, date), performance.page);
            if (result.status == 200 || result.status == 401) {
                res.status(result.status).send(result.data);
            }
            else {
                res.status(500).send('server is busying');
            }
        }
    }
    catch (error) {
        console.error('api getPerformances error:', error);
    }
});
exports.getPerformances = getPerformances;
const applyPerformance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body.data;
        const performance = class_transformer_1.plainToClass(BuskerPerformance_1.BuskerPerformance, JSON.parse(data));
        const errors = yield class_validator_1.validate(performance, { skipMissingProperties: true });
        if (errors.length > 0) {
            console.log('applyPerformance error:', errors);
            res.status(400).send(`parameter error`);
            return;
        }
        else {
            const memberId = req.user;
            const buskerId = yield buskerRepo.getIdByMemberId(memberId);
            performance.buskerId = buskerId;
            if (buskerId) {
                const result = yield buskerRepo.applyPerformance(performance);
                if (result.status == 200 || result.status == 401) {
                    res.status(result.status).send(result.data);
                }
            }
            else
                res.status(501).send('server is busying');
        }
    }
    catch (error) {
        console.error('api applyPerformance error:', error);
    }
});
exports.applyPerformance = applyPerformance;
const getAllPerformanceTime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield buskerRepo.getAllPerformanceTime();
        if (result.status == 200 || result.status == 401) {
            res.status(result.status).send(result.data);
        }
        else {
            res.status(500).send('server is busying');
        }
    }
    catch (error) {
        console.error('api getAllPerformanceTime error:', error);
    }
});
exports.getAllPerformanceTime = getAllPerformanceTime;
const deletePerformance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body.data;
        const performance = class_transformer_1.plainToClass(BuskerPerformance_1.GetPerformanceType, JSON.parse(data));
        const errors = yield class_validator_1.validate(performance);
        if (errors.length > 0) {
            // console.error(errors);
            res.status(400).send(`parameter error`);
            return;
        }
        else {
            const result = yield buskerRepo.deletePerformance(performance.performanceId);
            res.status(result.status).send(result.data);
        }
    }
    catch (error) {
        console.error('api deletePerformance error:', error);
    }
});
exports.deletePerformance = deletePerformance;
const getOnlineAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memberId = req.user;
        const buskerId = yield buskerRepo.getIdByMemberId(memberId);
        if (buskerId) {
            const result = yield buskerRepo.getTop5NewestHighestOnlineAmount(buskerId);
            res.status(result.status).send(result.data);
        }
        else {
            res.status(401).send(`failed to get data`);
            return;
        }
    }
    catch (error) {
        console.error('api getOnlineAmount error:', error);
    }
});
exports.getOnlineAmount = getOnlineAmount;
const getCommentAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const memberId = req.user;
        const buskerId = yield buskerRepo.getIdByMemberId(memberId);
        if (buskerId) {
            const result = yield buskerRepo.getTop5HighestCommentAmount(buskerId);
            res.status(result.status).send(result.data);
        }
        else {
            res.status(401).send(`failed to get data`);
            return;
        }
    }
    catch (error) {
        console.error('api getOnlineAmount error:', error);
    }
});
exports.getCommentAmount = getCommentAmount;
const getWeekCommentAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const memberId = req.user;
    const buskerId = yield buskerRepo.getIdByMemberId(memberId);
    if (buskerId) {
        const result = yield buskerRepo.getWeekCommentAmount(buskerId);
        res.status(result.status).send(result.data);
    }
    else {
        res.status(401).send(`failed to get data`);
        return;
    }
});
exports.getWeekCommentAmount = getWeekCommentAmount;
const getFuturePerformancesData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const memberId = req.user;
    const buskerId = yield buskerRepo.getIdByMemberId(memberId);
    if (buskerId) {
        const result = yield buskerRepo.getFuturePerformancesData(buskerId);
        res.status(result.status).send(result.data);
    }
    else {
        res.status(401).send(`failed to get data`);
        return;
    }
});
exports.getFuturePerformancesData = getFuturePerformancesData;
// export class BuskerController {
//     /**
//      * async name
//      */
//     public async enroll(req: Request, res: Response) {
//         try {
//             const encryptData = req.body.encryptData
//             const data = decrypt(encryptData)
//             const busker = plainToClass(Busker, JSON.parse(data))
//             const errors = await validate(busker, { skipMissingProperties: true })
//             if (errors.length > 0) {
//                 // console.error(errors);
//                 res.status(400).send(`parameter error`);
//                 return;
//             } else {
//                 const result = await buskerRepo.enroll(busker)
//                 if (result.status == 200 || result.status == 401) {
//                     res.status(result.status).send(result.data)
//                 }
//                 else {
//                     res.status(500).send('server is busying')
//                 }
//             }
//         } catch (error) {
//             console.error('api enroll error:', error);
//         }
//     }
// }
//# sourceMappingURL=buskerController.js.map