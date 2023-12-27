/* eslint-disable camelcase */
import { v2 as cloudinary } from 'cloudinary';
import createDebug from 'debug';
import { ImgData } from '../types/img.data';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('CS2HUB:mediaFiles');

export class MediaFiles {
  constructor() {
    cloudinary.config({
      cloud_name: 'dbhsorjvc',
      api_key: '121136356938468',
      api_secret: process.env.CLOUDINARY_SECRET,
      secure: true,
    });

    debug('Instantiated');
    debug('key:', cloudinary.config().api_key);
  }

  async uploadImage(imagePath: string) {
    try {
      const uploadApiResponse = await cloudinary.uploader.upload(imagePath, {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        format: 'webp',
      });

      const imgData: ImgData = {
        url: uploadApiResponse.url,
        publicId: uploadApiResponse.public_id,
        size: uploadApiResponse.bytes,
        height: uploadApiResponse.height,
        width: uploadApiResponse.width,
        format: uploadApiResponse.format,
      };

      return imgData;
    } catch (err) {
      const error = err as Error;
      throw new HttpError(406, 'Not Acceptable', error.message);
    }
  }
}
