import { UsersMongoRepo } from './users.mongo.repo';
import { UserModel } from './users.mongo.model.js';
import { Auth } from '../../services/auth.js';
import { LoginUser, User } from '../../entities/user';
import { HttpError } from '../../types/http.error';
import { NextFunction, Request, Response } from 'express';
import { errorMiddleware } from '../../middlewares/error';

jest.mock('./users.mongo.model.js');
jest.mock('../../services/auth.js');

const loginUserMock = {
  email: 'test@gmail.com',
  passwd: '123',
} as LoginUser;

describe('GivenUsersMongoRepo', () => {
  Auth.hash = jest.fn();
  Auth.compare = jest.fn().mockResolvedValue(true);
  let repo: UsersMongoRepo;
  describe('When we instantiate it without errors', () => {
    const exec = jest.fn().mockResolvedValue('Test');
    beforeEach(() => {
      const mockQueryMethod = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
        exec,
      });
      UserModel.find = mockQueryMethod;
      UserModel.findById = mockQueryMethod;
      UserModel.findOne = mockQueryMethod;
      UserModel.findByIdAndUpdate = mockQueryMethod;
      UserModel.findByIdAndDelete = mockQueryMethod;
      UserModel.create = jest.fn().mockResolvedValue('Test');

      repo = new UsersMongoRepo();
    });

    const req = {} as Request;
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    test('Then it should execute create', async () => {
      const result = await repo.create({} as Omit<User, 'id'>);
      expect(Auth.hash).toHaveBeenCalled();
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute login', async () => {
      const result = await repo.login(loginUserMock);
      expect(UserModel.findOne).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should fail execute login', async () => {
      const result = null;
      expect(result).toBe(null);
    });

    test('Then it should fail execute login', async () => {
      const error = new HttpError(401, 'Unauthorized');
      errorMiddleware(error, req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test('Then it should execute getAll', async () => {
      const result = await repo.getAll();
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute getById', async () => {
      const result = await repo.getById('');
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute update', async () => {
      const result = await repo.update('', { name: 'Test' });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });
  });
  describe('When we isntantiate it WITH errors', () => {
    const exec = jest.fn().mockResolvedValue(null);
    beforeEach(() => {
      UserModel.findById = jest.fn().mockReturnValue({
        exec,
      });
      UserModel.findOne = jest.fn().mockReturnValue({
        exec,
      });
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec,
      });
      repo = new UsersMongoRepo();
    });
    test('Then getById should throw an error', async () => {
      expect(repo.getById('')).rejects.toThrow();
    });

    test('Then update should throw an error', async () => {
      expect(repo.update('', { name: 'Test' })).rejects.toThrow();
    });

    test('Given delete method is unimplemented', async () => {
      const deleteMethod = () => repo.delete('');
      expect(deleteMethod).toThrow('Method not implemented.');
    });
    test('Given filter method is unimplemented', async () => {
      const searchMethod = () => repo.filter({ key: 'id', value: '' });
      expect(searchMethod).toThrow('Method not implemented.');
    });
    test('Then login should throw an error', async () => {
      expect(repo.login({} as User)).rejects.toThrow();
    });
    test('Then login should throw an HttpError', async () => {
      const req = {} as Request;
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;
      const next = jest.fn() as NextFunction;
      const error = new HttpError(
        404,
        'Not found',
        'The request was not found'
      );

      errorMiddleware(error, req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });
});
