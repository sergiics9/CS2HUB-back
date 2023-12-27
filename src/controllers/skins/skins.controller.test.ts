/* eslint-disable camelcase */
import { Request, Response, NextFunction } from 'express';
import { SkinsController } from './skins.controller';
import { SkinsMongoRepo } from '../../repos/skins/skins.mongo.repo';
import { HttpError } from '../../types/http.error';
import { SkinModel } from '../../repos/skins/skins.mongo.model';

describe('Given SkinsController class', () => {
  let controller: SkinsController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: { key: 'value' },
      file: {
        path: 'valid/path/to/image.jpg',
      },
    } as unknown as Request;
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      statusMessage: '',
    } as unknown as Response;
    mockNext = jest.fn();
  });

  describe('When we instantiate it without errors', () => {
    beforeEach(() => {
      const mockRepo = {
        getAll: jest.fn().mockResolvedValue([{}]),
        getById: jest.fn().mockResolvedValue({}),
        filter: jest.fn().mockResolvedValue({}),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue([{}]),
        delete: jest.fn().mockResolvedValue(undefined),
      } as unknown as SkinsMongoRepo;

      controller = new SkinsController(mockRepo);
    });

    test('Then getAll should...', async () => {
      await controller.getAll(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith([{}]);
    });

    test('Then getById should...', async () => {
      await controller.getById(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    test('Then filter should...', async () => {
      await controller.filter(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    test('Then update should...', async () => {
      const mockRequest = {
        files: {
          image: [
            {
              path: 'valid/path/to/image.jpg',
            },
          ],
          case_image: [
            {
              path: 'valid/path/to/caseImage.jpg',
            },
          ],
          collections_image: [
            {
              path: 'valid/path/to/collectionImage.jpg',
            },
          ],
        },
        body: {
          userId: 'someUserId',
        },
        params: {
          id: '1',
        },
      } as unknown as Request;

      const mockNext = jest.fn();
      const mockRepo = {
        create: jest.fn(),
      } as unknown as SkinsMongoRepo;

      const controller = new SkinsController(mockRepo);

      const mockImage = { url: 'https://example.com/image.jpg' };
      const mockCaseImage = { url: 'https://example.com/caseImage.jpg' };
      const mockCollectionsImage = {
        url: 'https://example.com/collectionImage.jpg',
      };

      const mockExistingItem = {
        image: 'https://example.com/existingImage.jpg',
        collections_image: 'https://example.com/existingCollectionsImage.jpg',
        case_image: 'https://example.com/existingCaseImage.jpg',
      };

      const findByIdMock = jest.fn().mockResolvedValue(mockExistingItem);
      (SkinModel.findById as jest.Mock) = findByIdMock;

      const mockCloudinaryService = {
        uploadImage: jest
          .fn()
          .mockResolvedValue(mockImage)
          .mockResolvedValue(mockCollectionsImage)
          .mockResolvedValue(mockCaseImage),
      };

      controller.cloudinaryService = mockCloudinaryService;

      await controller.update(mockRequest, mockResponse, mockNext);

      expect(mockResponse.statusMessage).toBe('');
      expect(findByIdMock).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockCloudinaryService.uploadImage).toHaveBeenCalled();
    });

    test('Then update should handle missing image files', async () => {
      const mockRequest = {
        files: {
          image: [
            {
              path: undefined,
            },
          ],
          case_image: [
            {
              path: undefined,
            },
          ],
          collections_image: [
            {
              path: undefined,
            },
          ],
        },
        body: {
          userId: 'someUserId',
        },
        params: {
          id: '1',
        },
      } as unknown as Request;

      const mockNext = jest.fn();
      const mockRepo = {
        update: jest.fn(),
      } as unknown as SkinsMongoRepo;

      const controller = new SkinsController(mockRepo);

      await controller.update(mockRequest, mockResponse, mockNext);

      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    test('Then delete should...', async () => {
      await controller.delete(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.statusMessage).toBe('No Content');
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    test('Then create should create a new skin with valid input data and image files', async () => {
      const mockRequest = {
        files: {
          image: [
            {
              path: 'valid/path/to/image.jpg',
            },
          ],
          case_image: [
            {
              path: 'valid/path/to/caseImage.jpg',
            },
          ],
          collections_image: [
            {
              path: 'valid/path/to/collectionImage.jpg',
            },
          ],
        },
        body: {
          userId: 'someUserId',
        },
      } as unknown as Request;

      const mockNext = jest.fn();
      const mockRepo = {
        create: jest.fn(),
      } as unknown as SkinsMongoRepo;

      const controller = new SkinsController(mockRepo);
      const mockImage = { url: 'https://example.com/image.jpg' };
      const mockCaseImage = { url: 'https://example.com/caseImage.jpg' };
      const mockCollectionsImage = {
        url: 'https://example.com/collectionImage.jpg',
      };

      const mockCloudinaryService = {
        uploadImage: jest
          .fn()
          .mockResolvedValue(mockImage)
          .mockResolvedValue(mockCaseImage)
          .mockResolvedValue(mockCollectionsImage),
      };

      controller.cloudinaryService = mockCloudinaryService;
      await controller.create(mockRequest, mockResponse, mockNext);

      expect(mockCloudinaryService.uploadImage).toHaveBeenCalled();
    });
  });

  describe('When we instantiate it with errors', () => {
    let mockError: Error;

    beforeEach(() => {
      mockError = new Error('Mock error');
      const mockRepo = {
        getAll: jest.fn().mockRejectedValue(mockError),
        getById: jest.fn().mockRejectedValue(mockError),
        filter: jest.fn().mockRejectedValue(mockError),
        create: jest.fn().mockRejectedValue(mockError),
        update: jest.fn().mockRejectedValue(mockError),
        delete: jest.fn().mockRejectedValue(mockError),
      } as unknown as SkinsMongoRepo;

      controller = new SkinsController(mockRepo);
    });

    test('Then getAll should...', async () => {
      await controller.getAll(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('Then getById should...', async () => {
      await controller.getById(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('Then filter should throw an error', async () => {
      await controller.filter(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('Then create should call next with an error if req.file is not defined', async () => {
      mockRequest.file = undefined;

      await controller.create(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(406, 'Not Acceptable', 'Invalid multer files')
      );
    });

    test('Then update should...', async () => {
      mockRequest.file = undefined;

      await controller.update(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(406, 'Not Acceptable', 'Invalid multer files')
      );
    });

    test('Then delete should...', async () => {
      await controller.delete(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
