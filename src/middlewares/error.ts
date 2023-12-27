import { NextFunction, Request, Response } from 'express';
import mongoose, { Error } from 'mongoose';
import { HttpError } from '../types/http.error.js';
import createDebug from 'debug';
const debug = createDebug('CS2HUB:error:middleware');

debug('Starting');
export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  debug('Middleware Errors');

  if (error instanceof HttpError) {
    res.status(error.status);
    res.statusMessage = error.statusMessage;
  } else if (error instanceof RangeError) {
    res.status(416);
    res.statusMessage = 'Request Range Not Satisfiable';
  } else if (error instanceof Error.ValidationError) {
    res.status(400);
    res.statusMessage = 'Bad Request';
  } else if (error instanceof mongoose.mongo.MongoServerError) {
    res.status(406);
    res.statusMessage = 'Not accepted';
  } else {
    res.status(500);
    res.statusMessage = 'Internal Server Error';
  }

  res.json({});
  debug((error as Error).name);
  debug((error as Error).message);
};
