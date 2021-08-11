import { Request, Response, NextFunction } from 'express';
export const authMember = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.member) {
        next()
    } else {
        res.status(401).send('logout fail')
    }
}