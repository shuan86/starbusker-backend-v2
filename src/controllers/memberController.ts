
import { Request, response, Response } from 'express';
import { IMember } from "../interfaces/IMember";
import { Member, LoginModeEnum } from "../entities/Member";
import * as memberRepo from '../repositories/memberRepo';
import { plainToClass, Expose } from "class-transformer";
import { validate } from "class-validator";
import { decrypt } from "../moudles/rsa";
import { LoginType, UpdateMemberInfoType, UpdatePassword } from '../entities/Member'
import passport from "../moudles/passport";
import { ReponseType } from 'types/reponseType';
import { envSetup } from "../envSetup";
import * as dotenv from 'dotenv'
dotenv.config({ path: envSetup() })
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
    passport.authenticate('login', async (err, data, info) => {
        if (data == false)
            res.status(401).send('login fail');
        const result = data as ReponseType
        res.status(result.status).send(result.data);

    })(req, res)
}
export const loginWithLine = () => {
    return passport.authenticate('line')
}
export const lineCallback = async (req: Request, res: Response) => {
    passport.authenticate('line', async (err, data, info) => {
        const { email, picture, name } = data
        const memberId = await memberRepo.getIdByEmail(email)
        const url = `${process.env.CLIENT_URL}?loginMode=line`
        if (memberId == -1) {
            const member = await memberRepo.createMember(new Member(email, name + '465789', true, email, name, picture, LoginModeEnum.Line, ''))
            req.login(member.id, (err) => { // I added req.login() here and now deserializeUser is being called and req.user is being set correctly.
                if (err) {
                    console.error('err:', err);
                }
            });
            const result = await memberRepo.getMemberInfoById(member.id)
            res.status(result.status).redirect(url)
        }
        else {
            await memberRepo.updateMemberInfoById(memberId, { email, avatar: picture, name })
            req.login(memberId, (err) => { // I added req.login() here and now deserializeUser is being called and req.user is being set correctly.
                if (err) {
                    console.error('err:', err);
                }
            });
            res.status(200).redirect(url)
        }
    })(req, res)
}
export const loginWithFB = () => {
    return passport.authenticate('facebook', { scope: ['email'] })
}
export const fbCallback = async (req: Request, res: Response) => {
    passport.authenticate('facebook', async (err, data, info) => {
        const { email, picture, name } = data
        const memberId = await memberRepo.getIdByEmail(email)
        const url = `${process.env.CLIENT_URL}?loginMode=facebook`
        if (memberId == -1) {
            const member = await memberRepo.createMember(new Member(email, name + '465789', true, email, name, picture, LoginModeEnum.Line, ''))
            req.login(member.id, (err) => { // I added req.login() here and now deserializeUser is being called and req.user is being set correctly.
                if (err) {
                    console.error('err:', err);
                }
            });
            const result = await memberRepo.getMemberInfoById(member.id)
            res.status(result.status).redirect(url)
        }
        else {
            await memberRepo.updateMemberInfoById(memberId, { email, avatar: picture, name })
            req.login(memberId, (err) => { // I added req.login() here and now deserializeUser is being called and req.user is being set correctly.
                if (err) {
                    console.error('err:', err);
                }
            });
            res.status(200).redirect(url)
        }
    })(req, res)
}

export const loginWithGoogle = () => {
    return passport.authenticate('google', { scope: ['profile', 'email'] })
}
export const googleCallback = async (req: Request, res: Response) => {
    passport.authenticate('google', async (err, data, info) => {
        const { email, picture, name } = data
        console.log('data:', data);

        const memberId = await memberRepo.getIdByEmail(email)
        const url = `${process.env.CLIENT_URL}?loginMode=facebook`
        if (memberId == -1) {
            const member = await memberRepo.createMember(new Member(email, name + '465789', true, email, name, picture, LoginModeEnum.Line, ''))
            req.login(member.id, (err) => { // I added req.login() here and now deserializeUser is being called and req.user is being set correctly.
                if (err) {
                    console.error('err:', err);
                }
            });
            const result = await memberRepo.getMemberInfoById(member.id)
            res.status(result.status).redirect(url)
        }
        else {
            await memberRepo.updateMemberInfoById(memberId, { email, avatar: picture, name })
            req.login(memberId, (err) => { // I added req.login() here and now deserializeUser is being called and req.user is being set correctly.
                if (err) {
                    console.error('err:', err);
                }
            });
            res.status(200).redirect(url)
        }
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
        const memberId = req.user as number
        const result = await memberRepo.getMemberInfoById(memberId)
        res.status(result.status).send(result.data)
    } catch (error) {
        console.error('api getMemberInfo error:', error);
    }
}
export const updateMemberInfo = async (req: Request, res: Response) => {
    try {
        const data: UpdateMemberInfoType = {
            name: req.body.name,
            email: req.body.email,
            avatar: req.file ? req.file.buffer : null
        }
        const infoData = plainToClass(UpdateMemberInfoType, data)
        const errors = await validate(infoData, { skipMissingProperties: true })
        if (errors.length > 0) {
            res.status(400).send(`parameter error`);
            return;
        }
        else {
            const memberId = req.user as number
            const result = await memberRepo.updateMemberInfoById(memberId, infoData)
            res.status(result.status).send(result.data)
        }

    } catch (error) {
        console.error('api updateMemberInfo error:', error);
    }
}
export const updatePassword = async (req: Request, res: Response) => {
    try {

        const encryptData = req.body.encryptData
        const data = decrypt(encryptData)
        const member = plainToClass(UpdatePassword, JSON.parse(data))
        const errors = await validate(member)
        if (errors.length > 0) {
            res.status(400).send(`parameter error`);
            return;
        } else {
            const result = await memberRepo.updateMemberPassword(req.user as number, member.oldPassword, member.newPassword)
            if (result.status == 200 || result.status == 401) {
                res.status(result.status).send(result.data)
            }
            else {
                res.status(500).send('server is busying')
            }
        }

    } catch (error) {
        console.error('api updatePassword error:', error);
    }
}