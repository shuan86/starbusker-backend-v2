import { Repository, getRepository, getConnection } from "typeorm";
import { Member } from '../entities/Member'
import { Busker } from '../entities/Busker'
import { BuskerPerformance } from '../entities/BuskerPerformance'
import { BuskerPerformanceComment } from '../entities/BuskerPerformanceComment'


export const getMemberRepos = (): Repository<Member> => {
    return getRepository(Member)
}
export const getBuskerRepo = (): Repository<Busker> => {
    return getRepository(Busker)
}
export const getBuskerPerformanceRepo = (): Repository<BuskerPerformance> => {
    return getRepository(BuskerPerformance)
}
export const getBuskerPerformanceCommentRepo = (): Repository<BuskerPerformanceComment> => {
    return getRepository(BuskerPerformanceComment)
}