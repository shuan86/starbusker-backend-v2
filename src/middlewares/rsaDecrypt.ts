import { Request, Response, NextFunction } from 'express';
import { decrypt } from "../moudles/rsa"
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { LoginType } from '../entities/Member'

export const loginRsaDecrypt = async (req: Request, res: Response, next: NextFunction) => {
    const encryptData = req.body.encryptData
    const data = decrypt(encryptData)
    const member = plainToClass(LoginType, JSON.parse(data))
    const errors = await validate(member, { skipMissingProperties: true })
    // if (errors.length == 0) {
    //     req.body.account = member.account
    //     req.body.password = member.password
    //     next()
    //     return
    // }
    // res.status(400).send(`parameter error`);
    req.body.account = member.account
    req.body.password = member.password
    next()
}