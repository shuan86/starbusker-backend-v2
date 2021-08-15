import { Busker, BuskerKind, EnrollBuskerType } from "../entities/Busker";
import { BuskerPerformance, ApplyPerformanceType } from "../entities/BuskerPerformance";

import { getBuskerRepo, getBuskerPerformanceRepo } from './databaseRepo'
import { ReponseType } from "../types/reponseType";
import { locationArr } from "../mock/buskerPerformance";
let mockCount = 0
export const generateEnrollBusker = (description: string, type: BuskerKind): EnrollBuskerType => {
    const data = new EnrollBuskerType(description, type)
    return data
}
export const generatePerformance = (buskerId: number, title: string, description: string, time: string, location: string, lineMoney: number = 0, latitude: number = 0, longitude: number = 0): BuskerPerformance => {
    const data: BuskerPerformance = {
        id: 0, buskerId, title, description
        , time, lineMoney, latitude, longitude, location, busker: null
    }
    return data
}
//front end format
export const generateApplyPerformance = (tile: string, description: string, time: string, location: string): ApplyPerformanceType => {
    const data = new ApplyPerformanceType(tile, description, time, location)
    return data
}


export const generateFixedMockData = (memberId: number): Busker => {
    // const mockData = { id: 0, memberId: memberId, type: BuskerKind.singer, description: `description` }
    // const mockMember = Object.assign(new Busker(), mockData)
    // return mockMember
    const mockData: Busker = {
        id: 0, memberId: memberId, type: BuskerKind.singer
        , description: `description`, member: null, performances: []
    }

    return { ...mockData }
}
export const generateDiffMockData = (memberId: number): Busker => {
    // const mockData = { id: 0, memberId: memberId, kind: BuskerKind.singer, description: `description${mockCount}` }
    // const mockMember = Object.assign(new Busker(), mockData)
    const mockData: Busker = {
        id: 0, memberId: memberId, type: BuskerKind.singer,
        description: `description${mockCount}`, member: null, performances: []
    }

    mockCount++
    return mockData
}
export const getCurrentData = () => {
    const date = new Date();
    const data = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' +
        ('00' + date.getUTCHours()).slice(-2) + ':' +
        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
        ('00' + date.getUTCSeconds()).slice(-2);
    return data
}
export const generateDiffPerformanceMockData = (buskerId: number): BuskerPerformance => {
    let count = mockCount
    if (mockCount > locationArr.length) {
        count = Math.floor(locationArr.length % count)
    }

    const mockData: BuskerPerformance = {
        id: 0, buskerId, title: `title${mockCount}`
        , description: `description${mockCount}`
        , time: getCurrentData()
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

export const applyPerformance = async (data: BuskerPerformance): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const repo = getBuskerPerformanceRepo()
        // const isPerformanceExist: BuskerPerformance = await repo.findOne({ id: data.buskerId })
        await repo.save(repo.create(data))
        repoData.status = 200
        repoData.data = ''
        return repoData
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
    } catch (error) {
        console.error('apply error:', error);
        return repoData
    }
}
export const applyMockPerformance = async (buskerId: number, data: BuskerPerformance): Promise<ReponseType> => {
    let repoData: ReponseType = { status: 501, data: '' }
    try {
        const repo = getBuskerPerformanceRepo()
        const isPerformanceExist: BuskerPerformance = await repo.findOne({ id: buskerId })
        if (isPerformanceExist) {

            await repo.save({ ...data })
            repoData.status = 200
            repoData.data = ''
            return repoData
        }
        else {
            await repo.save({ ...data })
            repoData.status = 200
            repoData.data = ''
            return repoData

        }
    } catch (error) {
        console.error('apply error:', error);
        return repoData
    }
}
export const isBuskerByMemberId = async (id: number): Promise<boolean> => {
    try {
        const repo = getBuskerRepo()
        const busker = await repo.findOne({ id })
        if (busker)
            return true
        else
            return false
    } catch (error) {
        console.error('isBuskerByMemberId:', error);
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
