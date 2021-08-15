import { Repository, getRepository, getConnection } from "typeorm";
import { Member } from '../entities/Member'
import { Busker } from '../entities/Busker'
import { BuskerPerformance } from '../entities/BuskerPerformance'


export const getMemberRepos = (): Repository<Member> => {
    // const connection = getConnection();
    // const repository = connection.getRepository(Member);
    // return repository
    return getRepository(Member)
}
export const getBuskerRepo = (): Repository<Busker> => {
    // const connection = getConnection();
    // const repository = connection.getRepository(Busker);
    // return repository
    return getRepository(Busker)

}
export const getBuskerPerformanceRepo = (): Repository<BuskerPerformance> => {
    // const connection = getConnection();
    // const repository = connection.getRepository(Busker);
    // return repository
    return getRepository(BuskerPerformance)

}