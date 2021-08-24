
import { Request, response, Response } from 'express';
import { IMember } from "../interfaces/IMember";
import { Member } from "../entities/Member";
import * as memberRepo from '../repositories/memberRepo';
import { plainToClass, Expose } from "class-transformer";
import { validate } from "class-validator";
import { decrypt } from "../moudles/rsa";
import { LoginType, UpdateMemberInfoType } from '../types/memberType'
import passport from "../moudles/passport";
import { ReponseType } from 'types/reponseType';
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
    passport.authenticate('login', async (err, data, info)=> {
        if(data==false)
        res.status(401).send('login fail');
        const result = data as ReponseType
        res.status(result.status).send(result.data);
        
    })(req, res)
}
export const logout = (req: Request, res: Response) => {
    try {
    //    console.log('logout:',req.isAuthenticated());
        req.logOut()
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
        const memberId=req.user as number
        const result = await memberRepo.getMemberInfoById(memberId)
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
            const memberId=req.user as number
            const result = await memberRepo.updateMemberInfoById(memberId, infoData)
            res.status(result.status).send(result.data)
        }
    } catch (error) {
        console.error('api updateMemberInfoById error:', error);
    }
}