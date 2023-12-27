import { Request, Response } from 'express';
import { FileInterceptor } from './file.interceptor';
import multer from 'multer';

jest.mock('multer');

const middlewareMock = jest.fn();
const fields = jest.fn().mockReturnValue(middlewareMock);
multer.diskStorage = jest
  .fn()
  .mockImplementation(({ filename }) => filename('', '', () => {}));
(multer as unknown as jest.Mock).mockReturnValue({
  fields,
});

describe('Given FileInterceptor class', () => {
  describe('When we instantiate it', () => {
    const interceptor = new FileInterceptor();

    test('Then singleFileStore should be used', () => {
      const multerInstance = multer();
      multerInstance.fields([{ name: 'image', maxCount: 1 }]);

      interceptor.multiFileStore();

      expect(multer.diskStorage).toHaveBeenCalled();
    });
  });

  describe('When we instantiate it WITH Errors', () => {
    const mockError = new Error('Mock error');

    const middlewareMock = jest.fn((req, res, next) => next(mockError));

    const multerMock = {
      fields: jest.fn(() => middlewareMock),
      diskStorage: jest.fn(),
    };

    (multer as jest.MockedFunction<typeof multer>).mockReturnValue(
      multerMock as any
    );

    const nextMock = jest.fn();
    const reqMock = { body: {} } as Request;
    const resMock = {} as Response;

    const interceptor = new FileInterceptor();

    test('Then the error should be passed to the next function', () => {
      interceptor.multiFileStore()(reqMock, resMock, nextMock);

      expect(nextMock).toHaveBeenCalledWith(mockError);
    });

    test('Then singleFileStore should be used', () => {
      middlewareMock.mockImplementation((_req, _res, next) => next());

      const reqMock = { body: { test: 'test' } } as unknown as Request;
      const nextMock = jest.fn();

      interceptor.multiFileStore()(reqMock, {} as Response, nextMock);

      expect(reqMock.body).toEqual({ test: 'test' });
      expect(nextMock).toHaveBeenCalled();
    });
  });
});
