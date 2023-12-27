import { Request, Response, NextFunction } from 'express';
import { UsersController } from './users.controller';
import { UsersMongoRepo } from '../../repos/users/users.mongo.repo';
import { Auth } from '../../services/auth';

jest.mock('express');

describe('Given UsersController class', () => {
  let controller: UsersController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: { key: 'value' },
    } as unknown as Request;
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
  });

  describe('When we instantiate it without errors', () => {
    test('Then login should...', async () => {
      const mockUserId = 'mockUserId';
      const mockLoginResult = {
        id: 'mockUserId',
        email: 'mock@example.com',
      };
      const mockRequest = {
        body: { userId: mockUserId },
      } as unknown as Request;
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockLoginResult),
        login: jest.fn().mockResolvedValue(mockLoginResult),
      } as unknown as UsersMongoRepo;

      const controller = new UsersController(mockRepo);

      await controller.login(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('When we instantiate it with errors', () => {
    let mockError: Error;
    beforeEach(() => {
      mockError = new Error('Mock error');
      const mockRepo = {
        login: jest.fn().mockRejectedValue(mockError),
      } as unknown as UsersMongoRepo;

      controller = new UsersController(mockRepo);
    });
    test('Then login should throw an error', async () => {
      await controller.login(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('Then create should...', async () => {
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    test('should set status, statusMessage, and send JSON data', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        role: 'User',
      };

      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockUser),
        login: jest.fn().mockResolvedValue(mockUser),
      } as unknown as UsersMongoRepo;

      const mockRequest = {
        body: { userId: '1' },
      } as unknown as Request;

      Auth.signJWT = jest.fn().mockReturnValue('mockToken');

      const usersController = new UsersController(mockRepo);

      await usersController.login(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(202);
      expect(mockResponse.statusMessage).toBe('Accepted');
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: mockUser,
        token: 'mockToken',
      });
    });
  });
});
