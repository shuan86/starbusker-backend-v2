import { Repository, getRepository } from "typeorm";
import { Member } from '../entities/Member'
import { Busker } from '../entities/Busker'


export const getMemberRepos = (): Repository<Member> => {
    return getRepository(Member)
}
export const getBuskerRepo = (): Repository<Busker> => {
    return getRepository(Busker)

}