import { Busker, BuskerType, EnrollBuskerType, } from "../entities/Busker";
import { Member } from "../entities/Member";
import {
    BuskerPerformance, ApplyPerformanceType, FrontEndPerformanceType
    , FrontEndHighestOnlineAmountType, FrontEndFuturePerformanceDataType, FrontEndPerformancesDoanteType
} from "../entities/BuskerPerformance";
import { getBuskerRepo, getBuskerPerformanceRepo, getMemberRepos, getBuskerPerformanceCommentRepo } from './databaseRepo'
import { ReponseType } from "../types/reponseType";
import { locationArr } from "../mock/buskerPerformance";
import {
    BuskerPerformanceComment, FrontEndCommentDataType, FrontEndHighestComentAmountType
    , FrontEndWeekCommentAmountType
} from "../entities/BuskerPerformanceComment";
import moment from 'moment';
import 'moment-timezone';
import { addDay, addDayReturnYearMonthDate } from '../moudles/time';
import { getMemberInfoDataById } from "./memberRepo";
import { createBuskerDonateLineOrder } from "../moudles/linePay";
let mockCount = 0
export const generateEnrollBusker = (description: string, type: BuskerType): EnrollBuskerType => {
    const data = new EnrollBuskerType(description, type)
    return data
}
export const generatePerformance = (buskerId: number, title: string, description: string, time: string, location: string, lineMoney: number = 0, latitude: number = 0, longitude: number = 0): BuskerPerformance => {
    const data = new BuskerPerformance(buskerId, title
        , description, time, lineMoney, 0, latitude
        , longitude, location
    )

    // const data: BuskerPerformance = {
    //     id: 0, buskerId, title, description
    //     , time, lineMoney, highestOnlineAmount: 0, latitude, longitude, location, busker: undefined, buskerPerformanceComments: undefined
    // }
    return data
}
//front end format
export const generateApplyPerformance = (tile: string, description: string, time: Date, location: string): ApplyPerformanceType => {
    const data = new ApplyPerformanceType(tile, description, time, location)
    return data
}
export const generatePerformanceComment = (buskerId: number, performanceId: number, memberId: number, comment: string, time: string) => {
    const data = new BuskerPerformanceComment(buskerId, performanceId, memberId, comment, time)
    return data
}

export const generateFixedMockData = (memberId: number): Busker => {
    const mockData = new Busker(memberId, BuskerType.singer, `description${mockCount}`, 0)
    return mockData
}
export const generateDiffMockData = (memberId: number): Busker => {
    const mockData = new Busker(memberId, BuskerType.singer, `description${mockCount}`, 0)
    mockCount++
    return mockData
}
export const getCurrentYearMonthDateTimeStr = () => {
    const dateOBJ = moment().format('YYYY-MM-DD')
    return dateOBJ
}

const parseFullTimeStr = (allStr: string) => {
    const strArr = allStr.split(' ')
    const yearMonthDateArr = strArr[0].split('-')//YYYY-MM-DD
    const hourMinuteSecond = strArr[1].split(':')//HH:mm:ss
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
    }
}
export const getCurrentTime = () => {
    const allStr = moment().format('YYYY-MM-DD HH:mm:ss')
    return {
        ...parseFullTimeStr(allStr)
    }
}
export const dateToDbDate = (date: Date) => {
    const data = date.getFullYear() + '-' +
        ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' +
        ('00' + date.getHours()).slice(-2) + ':' +
        ('00' + date.getMinutes()).slice(-2) + ':' +
        ('00' + date.getSeconds()).slice(-2);
    return data
}

export const generateDiffPerformanceData = (buskerId: number, time: string): BuskerPerformance => {
    let count = mockCount

    if (mockCount >= locationArr.length - 1) {
        count = Math.floor(count % locationArr.length)
    }
    const mockData = new BuskerPerformance(buskerId, `title${mockCount}`
        , `description${mockCount}`, time, 0, count, locationArr[count].latitude
        , locationArr[count].longtiude, locationArr[count].location
    )
    mockCount++
    return { ...mockData }
}


export const enroll = async (data: Busker) => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const busker = await createBusker(data)
        if (busker == null) {
            repoData.data = 'enroll fail:memberExist'
            repoData.status = 401
        }
        else {

            repoData.status = 200
            const infoData = await getMemberInfoDataById(busker.memberId)
            repoData.data = JSON.stringify(infoData)
        }
        return repoData
    } catch (error) {
        console.error('error enroll fail:', error);
        return repoData
    }
}
export const createBusker = async (data: Busker): Promise<Busker> => {
    try {
        const buskerRepo = getBuskerRepo()
        const isBuskerExist: Busker = await buskerRepo.findOne({ memberId: data.memberId })
        if (isBuskerExist) {
            return null
        }
        else {

            const orderReuslt = await createBuskerDonateLineOrder(data.memberId)
            if (orderReuslt.returnCode == '0000') {
                data.linePayOrderId = orderReuslt.orderId
                data.linePayTransactionId = orderReuslt.info.transactionId.toString()
                data.linePayOrderUrl = orderReuslt.info.paymentUrl.web
                return await buskerRepo.save(buskerRepo.create(data))
            }
            return null
        }
    } catch (error) {
        console.error('createBusker:', error);
        return null
    }
}
export const getPerformances = async (time: string, page: number): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    const perItem = 10
    try {
        const buskerPerformanceRepo = getBuskerPerformanceRepo()
        // time.setHours(0)
        // time.setMinutes(0)
        // time.setSeconds(0)
        const nextDate = addDay(time, 1)
        // const dataArrr = await buskerPerformanceRepo.createQueryBuilder('p')
        //     .select(['p.id', 'p.title', 'p.description', 'p.time', 'p.lineMoney', 'p.latitude', 'p.longitude'])
        //     .where("p.time BETWEEN '" + dateToDbDate(time) + "' AND '" + dateToDbDate(nextDate) + "'")
        //     .skip((page - 1) * perItem).take(perItem)
        //     .getManyAndCount()

        const dataArr = await buskerPerformanceRepo.createQueryBuilder('p')
            .select(['m.name name,b.id buskerId', 'p.id performanceId', 'p.title  title', 'p.description description', 'p.time time', 'p.lineMoney lineMoney', 'p.latitude latitude', 'p.longitude longitude', 'p.location location', 'm.avatar avatar'])
            .where("p.time BETWEEN '" + time + "' AND '" + nextDate + "'")
            .innerJoin(Busker, "b", "p.buskerId = b.id")
            .innerJoin(Member, "m", "m.id = b.memberId")
            .offset((page - 1) * perItem).limit(perItem)
            .getRawMany()
        for (let i = 0; i < dataArr.length; i++) {
            dataArr[i].avatar = dataArr[i].avatar == null ? '' : Buffer.from(dataArr[i].avatar).toString('base64')
        }
        const dataAmount = await buskerPerformanceRepo.createQueryBuilder('p')
            .skip((page - 1) * perItem).take(perItem)
            .where("p.time BETWEEN '" + time + "' AND '" + nextDate + "'")
            .leftJoinAndSelect(Busker, "b", "p.buskerId = b.id")
            .leftJoinAndSelect(Member, "m", "m.id = b.memberId").getCount()
        repoData.status = 200
        repoData.data = JSON.stringify({ dataArr, dataAmount })
        // console.log('repoData.data:', repoData.data);

        return repoData
    } catch (error) {
        console.error('apply error:', error);
        return repoData
    }
}
export const getAllPerformanceTime = async (): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const buskerPerformanceRepo = getBuskerPerformanceRepo()
        const dataArr = await buskerPerformanceRepo.createQueryBuilder("p")
            .select(['date(p.time) time'])
            .groupBy("date(p.time)").orderBy("p.time").getRawMany()
        repoData.status = 200
        repoData.data = JSON.stringify(dataArr)
        return repoData
    } catch (error) {
        console.error('getAllPerformanceTime error:', error);
        return repoData
    }
}
export const isPerformanceExist = async (id: number): Promise<boolean> => {
    try {
        const repo = getBuskerPerformanceRepo()
        const result = await repo.findOne({ id })
        if (result)
            return true
        return false
    } catch (error) {
        console.error('isPerformanceExist error', error);
    }
}


export const applyPerformance = async (memberId: number, data: BuskerPerformance): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const performanceRepo = getBuskerPerformanceRepo()
        const orderReuslt = await createBuskerDonateLineOrder(memberId)
        if (orderReuslt.returnCode == '0000') {
            data.linePayOrderId = orderReuslt.orderId
            data.linePayTransactionId = orderReuslt.info.transactionId.toString()
            data.linePayOrderUrl = orderReuslt.info.paymentUrl.web

        }
        else {
            repoData.data = 'line error'
            return repoData
        }
        const performanceResult = await performanceRepo.save(performanceRepo.create(data))
        if (performanceResult) {
            repoData.status = 200
            const reponseData: FrontEndPerformanceType = await performanceRepo.createQueryBuilder('p')
                .select(['p.id performanceId ', 'm.name name', 'm.email email'
                    , 'p.location location', 'p.description description', 'p.title title'
                    , 'p.latitude latitude', 'p.longitude longitude', 'p.time time'
                ])
                .innerJoin(Busker, 'b', `b.id=${performanceResult.buskerId}`)
                .innerJoin(Member, 'm', 'm.id=b.memberId')
                .where(`p.id=${performanceResult.id}`)
                .getRawOne()
            repoData.data = JSON.stringify(reponseData)
        }
        else {
            repoData.status = 401
            repoData.data = ''
        }
        return repoData
    } catch (error) {
        console.error('applyPerformance error:', error);
        return repoData
    }
}

export const deletePerformance = async (id: number): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const performanceRepo = getBuskerPerformanceRepo()
        const performance = await performanceRepo.findOne({ id })
        if (performance) {
            const result = await performanceRepo.remove(performance)
            if (result) {
                repoData.status = 200
                return repoData
            }
        }
        repoData.status = 401
        return repoData
    } catch (error) {
        console.error('deletePerformance error:', error);
        return repoData
    }
}


export const applyMockPerformance = async (data: BuskerPerformance): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const repo = getBuskerPerformanceRepo()

        await repo.save(repo.create(data))
        repoData.status = 200
        repoData.data = ''
        return repoData
    } catch (error) {
        console.error('applyPerformance error:', error);
        return repoData
    }
}
export const isBuskerByMemberId = async (memberId: number): Promise<boolean> => {
    try {
        const repo = getBuskerRepo()
        const busker = await repo.findOne({ memberId })
        if (busker)
            return true
        else
            return false
    } catch (error) {
        console.error('isBuskerByMemberId:', error);
        return false
    }
}
//not test
export const isBuskerIdExist = async (id: number): Promise<boolean> => {
    try {
        const repo = getBuskerRepo()
        const busker = await repo.findOne({ id })
        if (busker)
            return true
        else
            return false
    } catch (error) {
        console.error('isBuskerIdExist:', error);
        return false
    }
}
export const isPerformanceIdExist = async (id: number): Promise<BuskerPerformance> => {
    try {
        const repo = getBuskerPerformanceRepo()
        const performance = await repo.findOne({ id })
        if (performance)
            return performance
        else
            return null
    } catch (error) {
        console.error('isBuskerIdExist:', error);

    }
    return null
}
//not test
export const getBuskerInfoByBuskerId = async (buskerId: number): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const buskerRepo = getBuskerRepo()
        const data = await buskerRepo.createQueryBuilder('b')
            .select(['b.description description', 'b.likeAmount  likeAmount', 'b.type type', 'b.linePayOrderUrl linePayOrderUrl', 'm.name name', 'm.avatar avatar'])
            .innerJoin(Member, "m", "m.id = b.memberId")
            .where(`b.id=:buskerId`, { buskerId })
            .getRawOne()
        if (data) {
            // repoData.data = {name}
            console.log('data name:', data.name, buskerId);

            data.avatar = data.avatar == null ? '' : Buffer.from(data.avatar).toString('base64')
            repoData.status = 200
            repoData.data = JSON.stringify(data)
        }
        else {
            repoData.status = 401
        }
        return repoData
    } catch (error) {
        console.error('getBuskerInfoByBuskerId:', error);
        return repoData
    }
}
export const getPerformanceInfo = async (performanceId: number): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const performanceRepo = getBuskerPerformanceRepo()
        const data = await performanceRepo.createQueryBuilder('p')
            .select(['b.description description', 'b.likeAmount  likeAmount'
                , 'b.type type', 'p.linePayOrderUrl linePayOrderUrl', 'm.name name', 'm.avatar avatar'])
            .where(`p.id=:performanceId`, { performanceId })
            .innerJoin(Busker, "b", `b.id=p.buskerId`)
            .innerJoin(Member, "m", "m.id = b.memberId")
            .getRawOne()
        if (data) {
            data.avatar = data.avatar == null ? '' : Buffer.from(data.avatar).toString('base64')
            repoData.status = 200
            repoData.data = JSON.stringify(data)
        }
        else {
            repoData.status = 401
        }
        return repoData
    } catch (error) {
        console.error('getPerformanceInfo:', error);
        return repoData
    }
}
export const getPerformancesDonateByMemberId = async (memberId: number): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const memberRepo = getMemberRepos()
        const data: FrontEndPerformancesDoanteType = await memberRepo.createQueryBuilder('m')
            .select(['sum(p.lineMoney) amount'])
            .innerJoin(Busker, 'b', `b.memberId=m.id and m.id=:memberId`, { memberId })
            .innerJoin(BuskerPerformance, 'p', `p.buskerId=b.id`)
            .groupBy('p.buskerId')
            .getRawOne()

        if (data) {
            repoData.status = 200
            repoData.data = JSON.stringify(data)
        }
        else {
            repoData.status = 401
        }
        return repoData
    } catch (error) {
        console.error('getPerformancesDonate:', error);
        return repoData
    }
}


//not test
export const updateMaxChatroomOnlineAmount = async (performanceId: number, onlineAmount: number): Promise<boolean> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const performanceRepo = getBuskerPerformanceRepo()
        const performance = await performanceRepo.findOne({ id: performanceId })
        if (onlineAmount > performance.highestOnlineAmount) {
            await performanceRepo.update({ id: performanceId }, { highestOnlineAmount: onlineAmount })
            return true
        }
        return false
    } catch (error) {
        console.error('saveChatroomClientAmount:', error);
        return false
    }
}
export const getIdByMemberId = async (id: number): Promise<number> => {
    try {
        const repo = getBuskerRepo()
        const busker = await repo.findOne({ memberId: id })
        if (busker)
            return busker.id
        else
            return null
    } catch (error) {
        console.error('getIdByMemberId:', error);
    }
}
export const getNameBukserIdPerformanceIdByLinePayOrderId = async (orderId: string): Promise<{ name: string, performanceId: number, buskerId: number }> => {
    try {
        const performanceRepo = getBuskerPerformanceRepo()
        const data = await performanceRepo.createQueryBuilder('p')
            .select(['p.id performanceId', 'p.buskerId buskerId', 'm.name name'])
            .where(`p.linePayOrderId=:orderId`, { orderId: orderId })
            .innerJoin(Busker, 'b', `b.id = p.buskerId`)
            .innerJoin(Member, 'm', `m.id = b.memberId`)
            .getRawOne()
        if (data)
            return { name: data.name, performanceId: data.performanceId, buskerId: data.buskerId }
        else
            return null
    } catch (error) {
        console.error('getNameBukserIdPerformanceIdByLinePayOrderId:', error);
    }
}
export const getMemberIdByBuskerId = async (id: number): Promise<number> => {
    try {
        const repo = getBuskerRepo()
        const busker = await repo.findOne({ id: id })
        if (busker)
            return busker.memberId
        else
            return null
    } catch (error) {
        console.error('getIdByMemberId:', error);
    }
}
export const updateLinePayMoneyByPerformanceId = async (performanceId: number, money: number) => {
    try {
        const performanceRepo = getBuskerPerformanceRepo()
        const performance = await performanceRepo.findOne({ id: performanceId })
        if (performance) {
            const result = await performanceRepo.update(performanceId, { lineMoney: performance.lineMoney + money })
            console.log('updateLinePayMoneyBy PerformanceId:', performanceId, performance.lineMoney, money);

            if (result)
                return true
        }
        return false
    } catch (error) {
        console.error('updateLinePayMoneyByPerformanceId:', error);
        return false
    }
}
export const createPerformanceComment = async (data: BuskerPerformanceComment): Promise<Boolean> => {
    try {
        const commentRepo = getBuskerPerformanceCommentRepo()
        const result = await commentRepo.save(commentRepo.create(data))
        if (result) {
            return true
        }
    } catch (error) {
        console.error('createPerformanceComment:', error);

    }
    return false
}
export const getPerformanceCommentsByBuskerId = async (buskerId: number,): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const commentRepo = getBuskerPerformanceCommentRepo()
        const result: FrontEndCommentDataType[] = await commentRepo.createQueryBuilder('c')
            .select(['m.account account', 'c.comment comment', 'c.time time'])
            .where(`c.buskerId=${buskerId}`)
            .innerJoin(Member, 'm', `m.id=c.memberId`)
            .getRawMany()
        if (result) {
            // repoData.data = JSON.stringify({ dataArr: result })
            repoData.data = JSON.stringify(result)

            repoData.status = 200
        }
        else {
            repoData.status = 401
        }
        return repoData
    } catch (error) {
        console.error('getPerformanceCommentByBuskerId:', error);
        return repoData
    }
}
export const getTop5NewestHighestOnlineAmount = async (buskerId: number) => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const performanceRepo = getBuskerPerformanceRepo()
        // const result = await performanceRepo.find({select:['time'],where:{buskerId},group,order:{time:'DESC'}})
        const result: FrontEndHighestOnlineAmountType[] = await performanceRepo.createQueryBuilder('p')
            .select(['p.highestOnlineAmount highestOnlineAmount', 'p.time time'])
            .where(`p.buskerId=${buskerId}`).orderBy('p.highestOnlineAmount', 'DESC').skip(0).take(5).getRawMany()
        if (result) {
            // repoData.data = JSON.stringify({ dataArr: result })
            repoData.data = JSON.stringify(result)

            repoData.status = 200
        }
        else {
            repoData.status = 401
        }
        return repoData
    } catch (error) {
        console.error('getTop5MaxOnlineAmount:', error);

    }
    return repoData
}
export const getTop5HighestCommentAmount = async (buskerId: number) => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const commentRepo = getBuskerPerformanceCommentRepo()
        // const result = await performanceRepo.find({select:['time'],where:{buskerId},group,order:{time:'DESC'}})
        const result: FrontEndHighestComentAmountType[] = await commentRepo.createQueryBuilder('c')
            .select(['count(c.time) count', "DATE_FORMAT(c.time,'%Y/%m/%d') time"])
            .where(`c.buskerId=${buskerId}`).orderBy('c.time', 'DESC').groupBy('Date(c.time)').skip(0).take(5).getRawMany()
        if (result) {
            repoData.data = JSON.stringify(result)
            repoData.status = 200
        }
        else {
            repoData.status = 401
        }
        return repoData
    } catch (error) {
        console.error('getTop5MaxOnlineAmount:', error);

    }
    return repoData
}
export const getWeekCommentAmount = async (buskerId: number) => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const commentRepo = getBuskerPerformanceCommentRepo()
        const curTime = getCurrentYearMonthDateTimeStr()
        const sevenDaysAgo = addDayReturnYearMonthDate(curTime, -7)
        const result: FrontEndWeekCommentAmountType[] = await commentRepo.createQueryBuilder('c')//FrontEndWeekCommentAmountType[]
            .select(['count(c.time) count', "DATE_FORMAT(c.time,'%Y/%m/%d') time"])
            .andWhere(`c.buskerId = ${buskerId}`)
            .andWhere('c.time > :sevenDaysAgo', { sevenDaysAgo: sevenDaysAgo })
            .andWhere('c.time <= :curTime', { curTime: curTime })
            .groupBy('date(c.time)')
            .orderBy('c.time', 'DESC')
            .getRawMany()
        if (result) {
            repoData.data = JSON.stringify(result)
            repoData.status = 200
        }
        else {
            repoData.status = 401
        }
        return repoData
    } catch (error) {
        console.error('getWeekCommentAmount:', error);

    }
    return repoData
}
export const getFuturePerformancesData = async (buskerId: number) => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const performaceRepo = getBuskerPerformanceRepo()
        const curTime = getCurrentYearMonthDateTimeStr()
        const result: FrontEndFuturePerformanceDataType[] = await performaceRepo.createQueryBuilder('p')//FrontEndWeekCommentAmountType[]
            .select(['p.id performanceId', 'p.title title', 'p.location location', "DATE_FORMAT(p.time,'%Y/%m/%d %T') time",
                'p.description description', 'p.latitude latitude', 'p.longitude longitude',
                'm.name name', 'm.email email',
            ])
            .innerJoin(Busker, 'b', `b.id=${buskerId}`)
            .innerJoin(Member, 'm', 'm.id=b.memberId')
            .andWhere(`p.buskerId=${buskerId}`)
            .andWhere('p.time >= :curTime', { curTime: curTime })
            .orderBy('p.time', 'ASC')
            .getRawMany()
        if (result) {
            repoData.data = JSON.stringify(result)
            repoData.status = 200
        }
        else {
            repoData.status = 401
        }
        return repoData
    } catch (error) {
        console.error('getFuturePerformancesData:', error);

    }
    return repoData
}

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

export const clear = async () => {
    const buskerRepo = getBuskerRepo()
    const buskerPerformanceRepo = getBuskerPerformanceRepo()
    const preformanceRepo = getBuskerPerformanceRepo()
    const preformanceCommentRepo = getBuskerPerformanceCommentRepo()
    const comments = await preformanceCommentRepo.find()
    const preformances = await preformanceRepo.find()
    const buskers = await buskerRepo.find()
    for (const c of comments) {
        await preformanceCommentRepo.remove(c)
    }
    for (const p of preformances) {
        await buskerPerformanceRepo.remove(p)
    }
    for (const b of buskers) {
        await buskerRepo.remove(b)
    }
}
