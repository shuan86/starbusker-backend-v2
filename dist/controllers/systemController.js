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
exports.logout = exports.init = void 0;
const memberRepo = __importStar(require("../repositories/memberRepo"));
const buskerRepo = __importStar(require("../repositories/buskerRepo"));
const init = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield buskerRepo.clear();
    yield memberRepo.clear();
    let memberArr = [];
    let buskerArr = [];
    console.log('start init');
    for (let i = 0; i < 100; i++) {
        let memberData = memberRepo.generateDiffMemberMockData();
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
    res.status(200).send('sucessful init');
});
exports.init = init;
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