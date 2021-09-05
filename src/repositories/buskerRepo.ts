import { Busker, BuskerType, EnrollBuskerType, } from "../entities/Busker";
import { Member } from "../entities/Member";
import { BuskerPerformance, ApplyPerformanceType, FrontEndPerformanceType } from "../entities/BuskerPerformance";
import { getBuskerRepo, getBuskerPerformanceRepo, getMemberRepos } from './databaseRepo'
import { ReponseType } from "../types/reponseType";
import { locationArr } from "../mock/buskerPerformance";
import { geocoder } from "../moudles/nodeGeocoder";
import { createQueryBuilder } from 'typeorm'
let mockCount = 0
export const generateEnrollBusker = (description: string, type: BuskerType): EnrollBuskerType => {
    const data = new EnrollBuskerType(description, type)
    return data
}
export const generatePerformance = (buskerId: number, title: string, description: string, time: Date, location: string, lineMoney: number = 0, latitude: number = 0, longitude: number = 0): BuskerPerformance => {
    const data: BuskerPerformance = {
        id: 0, buskerId, title, description
        , time, lineMoney, latitude, longitude, location, busker: null
    }
    return data
}
//front end format
export const generateApplyPerformance = (tile: string, description: string, time: Date, location: string): ApplyPerformanceType => {
    const data = new ApplyPerformanceType(tile, description, time, location)
    return data
}


export const generateFixedMockData = (memberId: number): Busker => {
    // const mockData = { id: 0, memberId: memberId, type: BuskerKind.singer, description: `description` }
    // const mockMember = Object.assign(new Busker(), mockData)
    // return mockMember
    const mockData: Busker = {
        id: 0, memberId: memberId, type: BuskerType.singer
        , description: `description`, likeAmount: 0, member: null, performances: []
    }

    return { ...mockData }
}
export const generateDiffMockData = (memberId: number): Busker => {
    // const mockData = { id: 0, memberId: memberId, kind: BuskerKind.singer, description: `description${mockCount}` }
    // const mockMember = Object.assign(new Busker(), mockData)
    const mockData: Busker = {
        id: 0, memberId: memberId, type: BuskerType.singer,
        description: `description${mockCount}`, likeAmount: 0, member: null, performances: []
    }

    mockCount++
    return mockData
}
export const getCurrentDate = () => {
    const dateOBJ = new Date();
    const currDateOBJ = new Date();
    currDateOBJ.setFullYear(dateOBJ.getFullYear())
    currDateOBJ.setMonth(dateOBJ.getMonth())
    currDateOBJ.setDate(dateOBJ.getDate())
    currDateOBJ.setHours(dateOBJ.getHours())
    currDateOBJ.setMinutes(dateOBJ.getMinutes())
    currDateOBJ.setSeconds(dateOBJ.getSeconds())

    return currDateOBJ
}
export const getCurrentTime = () => {
    const dateOBJ = new Date();

    const data = dateOBJ.getUTCFullYear() + '-' +
        ('00' + (dateOBJ.getMonth() + 1)).slice(-2) + '-' +
        ('00' + dateOBJ.getDate()).slice(-2) + ' ' +
        ('00' + dateOBJ.getHours()).slice(-2) + ':' +
        ('00' + dateOBJ.getMinutes()).slice(-2) + ':' +
        ('00' + dateOBJ.getSeconds()).slice(-2);
    return {
        year: dateOBJ.getUTCFullYear(),
        month: dateOBJ.getMonth(),
        date: dateOBJ.getDate(),
        hour: dateOBJ.getHours(),
        minute: dateOBJ.getMinutes(),
        second: dateOBJ.getSeconds(),
        allStr: data
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

export const setCurrentData = (year: number, month: number, date: number, hour: number = 0, minute: number = 0, second: number = 0) => {
    const dateOBJ = new Date();
    dateOBJ.setUTCFullYear(year)
    dateOBJ.setMonth(month - 1)
    dateOBJ.setDate(date)
    dateOBJ.setHours(hour)
    dateOBJ.setMinutes(minute)
    dateOBJ.setSeconds(second)
    return dateOBJ

}
export const generateDiffPerformanceData = (buskerId: number, time: Date): BuskerPerformance => {
    let count = mockCount
    if (mockCount > locationArr.length - 1) {
        count = Math.floor(locationArr.length - 1 % count)
    }

    const mockData: BuskerPerformance = {
        id: 0, buskerId: buskerId, title: `title${mockCount}`
        , description: `description${mockCount}`
        , time: time
        , lineMoney: 0
        , latitude: locationArr[count].latitude
        , longitude: locationArr[count].longtiude
        , location: locationArr[count].location
        , busker: null
    }
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
            repoData.data = 'enroll suessful'
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
        const busker: Busker = await buskerRepo.findOne({ memberId: data.memberId })
        if (busker) {
            return null
        }
        else {
            return await buskerRepo.save(buskerRepo.create(data))
        }
    } catch (error) {
        console.error('createBusker:', error);
        return null
    }
}
export const getPerformances = async (time: Date, page: number): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    const perItem = 10
    try {
        const buskerPerformanceRepo = getBuskerPerformanceRepo()
        time.setHours(0)
        time.setMinutes(0)
        time.setSeconds(0)
        const nextDate = setCurrentData(time.getUTCFullYear(), time.getMonth() + 1, time.getDate() + 1, 23, 59)
        // const dataArrr = await buskerPerformanceRepo.createQueryBuilder('p')
        //     .select(['p.id', 'p.title', 'p.description', 'p.time', 'p.lineMoney', 'p.latitude', 'p.longitude'])
        //     .where("p.time BETWEEN '" + dateToDbDate(time) + "' AND '" + dateToDbDate(nextDate) + "'")
        //     .skip((page - 1) * perItem).take(perItem)
        //     .getManyAndCount()

        const dataArrr = await buskerPerformanceRepo.createQueryBuilder('p')
            .select(['b.id id', 'p.title  title', 'p.description description', 'p.time time', 'p.lineMoney lineMoney', 'p.latitude latitude', 'p.longitude longitude', 'm.avatar avatar'])
            .where("p.time BETWEEN '" + dateToDbDate(time) + "' AND '" + dateToDbDate(nextDate) + "'")
            .innerJoin(Busker, "b", "p.buskerId = b.id")
            .innerJoin(Member, "m", "m.id = b.memberId")
            .offset((page - 1) * perItem).limit(perItem)
            .getRawMany()
        for (let i = 0; i < dataArrr.length; i++) {
            dataArrr[i].avatar = dataArrr[i].avatar == null ? '' : Buffer.from(dataArrr[i].avatar).toString('base64')
        }
        const count = await buskerPerformanceRepo.createQueryBuilder('p')
            .skip((page - 1) * perItem).take(perItem)
            .where("p.time BETWEEN '" + dateToDbDate(time) + "' AND '" + dateToDbDate(nextDate) + "'")
            .leftJoinAndSelect(Busker, "b", "p.buskerId = b.id")
            .leftJoinAndSelect(Member, "m", "m.id = b.memberId").getCount()
        repoData.status = 200
        repoData.data = JSON.stringify([dataArrr, count])
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


export const applyPerformance = async (data: BuskerPerformance): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }

    try {
        const buskerRepo = getBuskerPerformanceRepo()
        // const geocode = await geocoder.geocode(data.location)
        // data.latitude = geocode[0].latitude
        // data.longitude = geocode[0].longitude

        const performanceResult = await buskerRepo.save(buskerRepo.create(data))
        if (performanceResult) {
            repoData.status = 200
            const reponseData: FrontEndPerformanceType = await buskerRepo.createQueryBuilder('p')
                .select(['p.id id ', 'm.name name', 'm.email email'
                    , 'p.location location', 'p.description description', 'p.title title', 'p.latitude latitude', 'p.longitude longitude', 'p.time time'])
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
        const repo = getBuskerPerformanceRepo()
        const performance = await repo.findOne({ id })
        if (performance) {
            const result = await repo.remove(performance)
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
//not test
export const getBuskerInfoByBuskerId = async (buskerId: number): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const buskerRepo = getBuskerRepo()
        const data = await buskerRepo.createQueryBuilder('b')
            .select(['b.description description', 'b.likeAmount  likeAmount', 'b.type type', 'm.name name', 'm.avatar avatar'])
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
    const preformances = await preformanceRepo.find()
    const buskers = await buskerRepo.find()
    for (const p of preformances) {
        await buskerPerformanceRepo.remove(p)
    }
    for (const b of buskers) {
        await buskerRepo.remove(b)
    }
}
