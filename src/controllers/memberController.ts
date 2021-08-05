
import { Request, response, Response } from 'express';
import { IMember } from "../interfaces/IMember";
import { Member } from "../entities/Member";
import { memberRepo } from '../repositories/memberRepo';
import { plainToClass, Expose } from "class-transformer";
import { validate } from "class-validator";


export const enroll = async (req: Request, res: Response) => {
    const member = plainToClass(Member, req.body)
    const errors = await validate(member, { skipMissingProperties: true })
    if (errors.length > 0) {
        console.error(errors);
        res.status(400).send(errors);
        return;
    } else {
        const result = await memberRepo.enroll(member)
        if (result.status == 200) {
            res.status(200).send('enroll sucessful')
        }
        else if (result.status == 400) {
            res.status(400).send('enroll parameter error')
        }
        else if (result.status == 401) {
            res.status(401).send('enroll fail:membe is exist')
        }
        else {
            res.status(500).send('server is busying')
        }
    }
}
