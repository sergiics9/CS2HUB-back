import { Router as createRouter } from 'express';
import { SkinsController } from '../controllers/skins/skins.controller.js';
import createDebug from 'debug';
import { SkinsMongoRepo } from '../repos/skins/skins.mongo.repo.js';
import { AuthInterceptor } from '../middlewares/auth.interceptor.js';
import { FileInterceptor } from '../middlewares/file.interceptor.js';

const debug = createDebug('CS2HUB:skins:router');

export const skinsRouter = createRouter();
debug('Starting');

const repo = new SkinsMongoRepo();
const controller = new SkinsController(repo);
const interceptor = new AuthInterceptor();
const fileInterceptor = new FileInterceptor();

skinsRouter.get('/', controller.getAll.bind(controller));

skinsRouter.get('/filter', controller.filter.bind(controller));

skinsRouter.get('/:id', controller.getById.bind(controller));

skinsRouter.post(
  '/',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  fileInterceptor.multiFileStore().bind(fileInterceptor),
  controller.create.bind(controller)
);

skinsRouter.patch(
  '/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  fileInterceptor.multiFileStore().bind(fileInterceptor),
  controller.update.bind(controller)
);

skinsRouter.delete(
  '/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  controller.delete.bind(controller)
);
