import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import crypto from 'crypto';

export class FileInterceptor {
  multiFileStore(fileSize = 8_000_000) {
    const options: multer.Options = {
      storage: multer.diskStorage({
        destination: './public/uploads',
        filename(_req, file, callback) {
          const prefix = crypto.randomUUID();
          callback(null, prefix + '-' + file.originalname);
        },
      }),
      limits: { fileSize },
    };

    const fields = [
      { name: 'image', maxCount: 1 },
      { name: 'collections_image', maxCount: 1 },
      { name: 'case_image', maxCount: 1 },
    ];

    const middleware = multer(options).fields(fields);

    return (req: Request, res: Response, next: NextFunction) => {
      const previousBody = req.body;
      middleware(req, res, (err) => {
        if (err) {
          next(err);
        } else {
          req.body = { ...previousBody, ...req.body };
          next();
        }
      });
    };
  }
}
