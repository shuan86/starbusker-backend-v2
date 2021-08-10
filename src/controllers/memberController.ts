
import { Request, response, Response } from 'express';
import { IMember } from "../interfaces/IMember";
import { Member } from "../entities/Member";
import { memberRepo } from '../repositories/memberRepo';
import { plainToClass, Expose } from "class-transformer";
import { validate } from "class-validator";
import { decrypt } from "../moudles/rsa";
import { LoginType, FrontEndMemberDataType } from '../types/memberType'
declare module 'express-session' {
    interface SessionData {
        member: number;
    }
}
export const init = async (req: Request, res: Response) => {
    try {
        await memberRepo.enroll(memberRepo.generateFixedMemberMockData())
        res.status(200).send('sucessful init')
    } catch (error) {
        console.error('api enroll error:', error);
    }
}



export const enroll = async (req: Request, res: Response) => {
    try {
        const encryptData = req.body.encryptData
        const data = decrypt(encryptData)
        const member = plainToClass(Member, JSON.parse(data))
        const errors = await validate(member, { skipMissingProperties: true })
        if (errors.length > 0) {
            // console.error(errors);
            res.status(400).send(`error format`);
            return;
        } else {
            const result = await memberRepo.enroll(member)
            if (result.status == 200 || result.status == 401) {
                res.status(result.status).send(result.data)
            }
            else {
                res.status(500).send('server is busying')
            }
        }
    } catch (error) {
        console.error('api enroll error:', error);
    }
}
export const login = async (req: Request, res: Response) => {
    try {
        const encryptData = req.body.encryptData
        const data = decrypt(encryptData)
        const member = plainToClass(LoginType, JSON.parse(data))
        const errors = await validate(member, { skipMissingProperties: true })
        if (errors.length > 0) {
            res.status(400).send(`login parameter error`);
            return;
        } else {
            const result = await memberRepo.login(member)
            if (result.status == 200) {
                const memberId = await memberRepo.getIdByAccount(member.account)
                req.session.member = memberId
                res.status(result.status).send(result.data)
            }
            else if (result.status == 401) {
                res.status(result.status).send(result.data)
            }
            else {
                res.status(500).send('server is busying')
            }
        }
    } catch (error) {
        console.error('api login error:', error);
    }
}
