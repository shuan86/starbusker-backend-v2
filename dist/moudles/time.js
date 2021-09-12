"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDate = exports.addDayReturnYearMonthDate = exports.addDay = exports.addTime = exports.getCurrentFullTimeStr = void 0;
const moment_1 = __importDefault(require("moment"));
require("moment-timezone");
const getCurrentFullTimeStr = () => {
    const dateOBJ = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
    return dateOBJ;
};
exports.getCurrentFullTimeStr = getCurrentFullTimeStr;
const addTime = (timeStr, month = 0, date = 0, hour = 0, minute = 0, second = 0) => {
    return moment_1.default(timeStr, "YYYY-MM-DD HH:mm:ss").add(month, 'months').add(date, 'days').add(hour, 'hours').add(minute, 'minutes').format('YYYY-MM-DD HH:mm:ss');
};
exports.addTime = addTime;
const addDay = (timeStr, addDays) => {
    return moment_1.default(timeStr, "YYYY-MM-DD HH:mm:ss").add(addDays, 'days').format('YYYY-MM-DD HH:mm:ss');
};
exports.addDay = addDay;
const addDayReturnYearMonthDate = (timeStr, addDays) => {
    return moment_1.default(timeStr, "YYYY-MM-DD").add(addDays, 'days').format('YYYY-MM-DD');
};
exports.addDayReturnYearMonthDate = addDayReturnYearMonthDate;
const setDate = (year, month, date, hour = 0, minute = 0, second = 0) => {
    const dateStr = `${year}-${month}-${date}`;
    const timeStr = `${hour}:${minute}:${second}`;
    const dateOBJ = moment_1.default(dateStr + ' ' + timeStr, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    return dateOBJ;
};
exports.setDate = setDate;
//# sourceMappingURL=time.js.map