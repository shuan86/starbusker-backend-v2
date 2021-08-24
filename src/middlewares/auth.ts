import { Request, Response, NextFunction } from 'express';
export const authMember = (req: Request, res: Response, next: NextFunction) => {
    // console.log('logout:',req.isAuthenticated());
    if (req.isAuthenticated()) { return next() }
    else{
        res.status(401).send('you need to login first')
    }
}