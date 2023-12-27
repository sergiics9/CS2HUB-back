import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error';
import mongoose, { mongo } from 'mongoose';
import { errorMiddleware } from './error';

describe('Given the errorMiddleware middleware', () => {
  describe('When it is instantiate', () => {
    const req = {} as Request;
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    test('When it is instantiate with a HttpError, then it should set a status, a statusMessage', () => {
      const error = new HttpError(
        404,
        'Not found',
        'The request was not found'
      );

      errorMiddleware(error, req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test('When it is not instantiate with a HttpError, it should set status to 500 and call the send method with an error object', () => {
      const error = new Error('Request Range Not Satisfiable');

      errorMiddleware(error, req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(next).not.toHaveBeenCalled();
    });

    test('When it is instantiate with a RangeError, then it should set a status, a statusMessage', () => {
      const error = new RangeError('Request Range Not Satisfiable');

      errorMiddleware(error, req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test('When it is instantiate with a mongoose.Error.ValidationError, then it should set a status, a statusMessage', () => {
      const error = new mongoose.Error.ValidationError();

      errorMiddleware(error, req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test('When it is instantiate with a mongo.MongoServerError, then it should set a status, a statusMessage', () => {
      const error = new mongo.MongoServerError({
        ErrorDescription: 'MongoDB server error',
      });

      errorMiddleware(error, req, res, next);
      expect(res.status).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });
});
