/* eslint-disable camelcase */
import { v2 as cloudinary } from 'cloudinary';
import { MediaFiles } from './media.files';
import { HttpError } from '../types/http.error';

describe('Given the Media File class', () => {
  describe('When we use its methods with a valid imagePath', () => {
    test('Then should upload an image successfully', async () => {
      const imagePath = 'valid/image/path.webp';
      const uploadApiResponse = {
        url: 'https://example.com/image.webp',
        public_id: 'public_id',
        bytes: 1000,
        height: 500,
        width: 500,
        format: 'webp',
      };
      cloudinary.uploader.upload = jest
        .fn()
        .mockResolvedValue(uploadApiResponse);
      const mediaFiles = new MediaFiles();
      const result = await mediaFiles.uploadImage(imagePath);
      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(imagePath, {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        format: 'webp',
      });
      expect(result).toEqual({
        url: 'https://example.com/image.webp',
        publicId: 'public_id',
        size: 1000,
        height: 500,
        width: 500,
        format: 'webp',
      });
    });
    describe('When we use its methods with errors', () => {
      test('Then uploadImage should throw a HttpError', async () => {
        (cloudinary.uploader.upload as jest.Mock).mockRejectedValue(
          new HttpError(406, 'Not Acceptable')
        );
        const mediaFiles = new MediaFiles();
        await expect(mediaFiles.uploadImage('')).rejects.toThrow(HttpError);
      });
    });
  });
});
