import moment from 'moment';
import 'moment-timezone';
export const getCurrentFullTimeStr = () => {
    const dateOBJ = moment().format('YYYY-MM-DD HH:mm:ss')
    return dateOBJ
}
export const addTime = (timeStr: string, month: number = 0, date: number = 0, hour: number = 0, minute: number = 0, second: number = 0) => {
    return moment(timeStr, "YYYY-MM-DD HH:mm:ss").add(month, 'months').add(date, 'days').add(hour, 'hours').add(minute, 'minutes').format('YYYY-MM-DD HH:mm:ss');
}
export const addDay = (timeStr: string, addDays: number) => {
    return moment(timeStr, "YYYY-MM-DD HH:mm:ss").add(addDays, 'days').format('YYYY-MM-DD HH:mm:ss');
}
export const addDayReturnYearMonthDate = (timeStr: string, addDays: number) => {
    return moment(timeStr, "YYYY-MM-DD").add(addDays, 'days').format('YYYY-MM-DD');
}
export const setDate = (year: number, month: number, date: number, hour: number = 0, minute: number = 0, second: number = 0) => {
    const dateStr = `${year}-${month}-${date}`;
    const timeStr = `${hour}:${minute}:${second}`;
    const dateOBJ = moment(dateStr + ' ' + timeStr, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')

    return dateOBJ

}