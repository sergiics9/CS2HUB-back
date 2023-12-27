import { Skin } from '../../entities/skin';
import { SkinModel } from './skins.mongo.model.js';
import { Repository } from '../repo.js';
import { HttpError } from '../../types/http.error.js';
import createDebug from 'debug';
import { UsersMongoRepo } from '../users/users.mongo.repo.js';
import { UserModel } from '../users/users.mongo.model.js';

const debug = createDebug('CS2HUB:skins:mongo:repo');

export class SkinsMongoRepo implements Repository<Skin> {
  userRepo: UsersMongoRepo;
  constructor() {
    this.userRepo = new UsersMongoRepo();

    debug('Instantiated');
  }

  async getAll(): Promise<Skin[]> {
    const result = await SkinModel.find()
      .populate('author', {
        skins: 0,
      })
      .exec();
    return result;
  }

  async getById(id: string): Promise<Skin> {
    const result = await SkinModel.findById(id)
      .populate('author', {
        skins: 0,
      })
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'GetById not possible');
    return result;
  }

  async filter({
    key,
    value,
  }: {
    key: keyof Skin;
    value: unknown;
  }): Promise<Skin[]> {
    const result = await SkinModel.find({ [key]: value })
      .populate('author', {
        skins: 0,
      })
      .exec();
    return result;
  }

  async create(newItem: Omit<Skin, 'id'>): Promise<Skin> {
    const userID = newItem.author.id;
    const user = await this.userRepo.getById(userID);
    const result: Skin = await SkinModel.create({ ...newItem, author: userID });
    user.skins.push(result);
    await this.userRepo.update(userID, user);
    return result;
  }

  async update(id: string, updatedItem: Partial<Skin>): Promise<Skin> {
    const result = await SkinModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    })
      .populate('author', {
        skins: 0,
      })
      .exec();
    if (!result) throw new HttpError(404, 'Not Found', 'Update not possible');
    return result;
  }

  async delete(id: string): Promise<void> {
    const skin = (await SkinModel.findByIdAndDelete(
      id
    ).exec()) as unknown as Skin;
    if (!skin) {
      throw new HttpError(404, 'Not Found', 'Delete not possible');
    }

    await UserModel.findByIdAndUpdate(skin.author, {
      $pull: { skins: id },
    }).exec();
  }
}
