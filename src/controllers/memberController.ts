
import { Request, response, Response } from 'express';
import { IMember } from "../interfaces/IMember";
import { Member } from "../entities/Member";
import * as memberRepo from '../repositories/memberRepo';
import { plainToClass, Expose } from "class-transformer";
import { validate } from "class-validator";
import { decrypt } from "../moudles/rsa";
import { LoginType, UpdateMemberInfoType } from '../types/memberType'

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
            res.status(400).send(`parameter error`);
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
            res.status(400).send(`parameter error`);
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
export const logout = (req: Request, res: Response) => {
    try {

        req.session.destroy(() => {
            console.log('session destroyed')
        })
        res.status(200).send('')
    } catch (error) {
        console.error('api logout error:', error);
    }
}

export const getMemberInfo = async (req: Request, res: Response) => {
    try {
        const result = await memberRepo.getMemberInfoById(req.session.member)
        res.status(result.status).send(result.data)
    } catch (error) {
        console.error('api getMemberInfo error:', error);
    }
}
export const updateMemberInfo = async (req: Request, res: Response) => {
    try {
        const encryptData = req.body.encryptData
        const data = decrypt(encryptData)
        const infoData = plainToClass(UpdateMemberInfoType, JSON.parse(data))
        const errors = await validate(infoData, { skipMissingProperties: true })
        if (errors.length > 0) {
            // console.error(errors);
            res.status(400).send(`parameter error`);
            return;
        }
        else {
            const result = await memberRepo.updateMemberInfoById(req.session.member, infoData)
            res.status(result.status).send(result.data)
        }
    } catch (error) {
        console.error('api updateMemberInfoById error:', error);
    }
}