import createDebug from 'debug';
import { Router as createRouter } from 'express';
import { UsersMongoRepo } from '../repos/users/users.mongo.repo.js';

import { UsersController } from '../controllers/users/users.controller.js';
import { AuthInterceptor } from '../middlewares/auth.interceptor.js';

const debug = createDebug('CS2HUB:users:router');

export const usersRouter = createRouter();
debug('Starting');

const repo = new UsersMongoRepo();
const controller = new UsersController(repo);
const interceptor = new AuthInterceptor();

usersRouter.get(
  '/',
  // Interceptor.authorization.bind(interceptor),
  controller.getAll.bind(controller)
);

usersRouter.post('/register', controller.create.bind(controller));

usersRouter.post('/login', controller.login.bind(controller));

// Mantiene la sesion al hacer F5
usersRouter.patch(
  '/login',
  interceptor.authorization.bind(interceptor),
  controller.login.bind(controller)
);
