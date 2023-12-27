/* eslint-disable no-undef */
/* eslint-disable dot-notation */
/* eslint-disable camelcase */
import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Skin } from '../../entities/skin.js';
import { Controller } from '../controller.js';
import { HttpError } from '../../types/http.error.js';
import { SkinsMongoRepo } from '../../repos/skins/skins.mongo.repo.js';
import { SkinModel } from '../../repos/skins/skins.mongo.model.js';

const debug = createDebug('SKINS:skins:controller');

export class SkinsController extends Controller<Skin> {
  constructor(protected repo: SkinsMongoRepo) {
    super(repo);
    debug('Instantiated');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.author = { id: req.body.userId };

      if (!req.files)
        throw new HttpError(406, 'Not Acceptable', 'Invalid multer files');

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const image = await this.cloudinaryService.uploadImage(
        files['image'][0].path
      );
      const collectionsImage = await this.cloudinaryService.uploadImage(
        files['collections_image'][0].path
      );
      const caseImage = await this.cloudinaryService.uploadImage(
        files['case_image'][0].path
      );

      req.body.image = image;
      req.body.collections_image = collectionsImage;
      req.body.case_image = caseImage;

      super.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const existingItem = await SkinModel.findById(req.params.id);
      const existingImage = existingItem!.image;
      const existingCollectionsImage = existingItem!.collections_image;
      const existingCaseImage = existingItem!.case_image;
      if (!req.files)
        throw new HttpError(406, 'Not Acceptable', 'Invalid multer files');

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const image =
        files['image'] && files['image'][0]?.path
          ? await this.cloudinaryService.uploadImage(files['image'][0].path)
          : existingImage;
      const collectionsImage =
        files['collections_image'] && files['collections_image'][0]?.path
          ? await this.cloudinaryService.uploadImage(
              files['collections_image'][0]?.path
            )
          : existingCollectionsImage;
      const caseImage =
        files['case_image'] && files['case_image'][0]?.path
          ? await this.cloudinaryService.uploadImage(
              files['case_image'][0].path
            )
          : existingCaseImage;

      req.body.image = image;
      req.body.collections_image = collectionsImage;
      req.body.case_image = caseImage;

      super.update(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}
