import { Request, Response } from 'express';
import { Auth } from '../services/auth';
import { AuthInterceptor } from './auth.interceptor';
import { HttpError } from '../types/http.error';

describe('Given the class AuthInterceptor', () => {
  const authInterceptor = new AuthInterceptor();
  const mockeResponse = {} as unknown as Response;
  const mockNext = jest.fn();
  describe('When it is instantiated and...', () => {
    test('Then, when the method authorization() is called', () => {
      const mockRequest = {
        get: jest.fn().mockReturnValue('Bearer Token'),
        body: {},
      } as unknown as Request;
      Auth.verifyAndGetPayload = jest.fn().mockReturnValueOnce({ id: '1' });
      authInterceptor.authorization(mockRequest, mockeResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });
  describe('When it is intantiated and there are errors', () => {
    test('When there is not authorization', () => {
      const mockRequest = {
        get: jest.fn().mockReturnValue(null),
        body: {},
      } as unknown as Request;
      authInterceptor.authorization(mockRequest, mockeResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });
  describe('When it is instantiated and...', () => {
    test('Then, when the method isAdmin() is called with valid role', () => {
      const mockRequest = {
        body: {
          tokenRole: 'Admin',
        },
      } as unknown as Request;

      authInterceptor.isAdmin(mockRequest, mockeResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('Then, when the method isAdmin() is called with invalid role', () => {
      const mockRequest = {
        body: {
          tokenRole: 'User',
        },
      } as unknown as Request;

      authInterceptor.isAdmin(mockRequest, mockeResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(HttpError));
    });
  });
});
