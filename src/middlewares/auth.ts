import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
export const authMember = (req: Request, res: Response, next: NextFunction) => {
    // console.log('logout:',req.isAuthenticated());
    if (req.isAuthenticated()) { return next() }
    else {
        res.status(401).send('you need to login first')
    }
}

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024,  // 限制 2 MB
    },
    fileFilter(req: Request, file, callback) {  // 限制檔案格式為 image
        if (!file.mimetype.match(/^image/)) {
            console.log('upload error');

            callback(new Error('檔案格式錯誤'));
        } else {
            console.log('upload correct');

            callback(null, true);
        }
    }
});
