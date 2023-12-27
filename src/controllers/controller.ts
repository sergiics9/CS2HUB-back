import { Repository } from '../repos/repo';
import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { MediaFiles } from '../services/media.files.js';

const debug = createDebug('CS2HUB:auth:interceptor');

export abstract class Controller<T extends { id: unknown }> {
  cloudinaryService: MediaFiles;

  // eslint-disable-next-line no-unused-vars
  constructor(protected repo: Repository<T>) {
    this.cloudinaryService = new MediaFiles();
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.getAll();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.getById(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async filter(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.filter({
        key: Object.entries(req.query)[0][0] as keyof T,
        value: Object.entries(req.query)[0][1],
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.create(req.body);
      debug('desde create');
      res.status(201);
      res.statusMessage = 'Created';
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.update(req.params.id, req.body);
      res.status(201);
      res.statusMessage = 'Updated';
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.repo.delete(req.params.id);
      res.status(204);
      res.statusMessage = 'No Content';
      res.json({});
    } catch (error) {
      next(error);
    }
  }
}
