import { SkinsMongoRepo } from './skins.mongo.repo';
import { SkinModel } from './skins.mongo.model.js';
import { Skin } from '../../entities/skin';
import { UsersMongoRepo } from '../users/users.mongo.repo';
import { UserModel } from '../users/users.mongo.model';

jest.mock('./skins.mongo.model.ts');
jest.mock('../users/users.mongo.model');

describe('Given SkinsMongoRepo', () => {
  let repo: SkinsMongoRepo;
  describe('When we instantiate it without errors', () => {
    const exec = jest.fn().mockResolvedValue('Test');
    beforeEach(() => {
      SkinModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      SkinModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      SkinModel.create = jest.fn().mockResolvedValue('Test');
      SkinModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      repo = new SkinsMongoRepo();
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

    test('Then it should execute filter', async () => {
      const result = await repo.filter({ key: 'name', value: 'test' });
      expect(exec).toHaveBeenCalled();
      expect(result).toBe('Test');
    });

    test('Then it should execute create', async () => {
      UsersMongoRepo.prototype.getById = jest.fn().mockResolvedValue({
        skins: [],
      });
      UsersMongoRepo.prototype.update = jest.fn();
      const result = await repo.create({ author: {} } as Omit<Skin, 'id'>);
      expect(result).toBe('Test');
    });

    test('Then it should execute update', async () => {
      UsersMongoRepo.prototype.getById = jest.fn().mockResolvedValue({
        skins: [],
      });
      UsersMongoRepo.prototype.update = jest.fn();
      const result = await repo.update('1', { name: 'Dragon Lore' });
      expect(result).toBe('Test');
    });

    test('should delete the skin and remove it from the author skins array', async () => {
      const id = 'testId';

      const exec = jest.fn().mockResolvedValue({});
      SkinModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec,
      });

      UserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        exec,
      });
      await repo.delete(id);

      expect(SkinModel.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('When we instantiate it WITH errors', () => {
    const exec = jest.fn().mockRejectedValue(new Error('Test'));
    beforeEach(() => {
      SkinModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });
      repo = new SkinsMongoRepo();
    });

    test('Then it should execute getById', async () => {
      expect(repo.getById('')).rejects.toThrow();
    });

    test('should throw an error if the skin does not exist', async () => {
      const id = 'testId';
      const exec = jest.fn().mockResolvedValueOnce(null);
      SkinModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      await expect(repo.getById(id)).rejects.toThrow();
    });
  });

  describe('delete', () => {
    test('should throw an error if the skin does not exist', async () => {
      const id = 'testId';
      const exec = jest.fn().mockResolvedValueOnce(null);
      SkinModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec,
      });

      await expect(repo.delete(id)).rejects.toThrow();
    });
  });
  describe('update', () => {
    test('should throw an error if the skin does not exist', async () => {
      const id = 'testId';
      const updatedItem = { name: 'test' };
      const exec = jest.fn().mockResolvedValueOnce(null);
      SkinModel.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec,
        }),
      });

      await expect(repo.update(id, updatedItem)).rejects.toThrow();
    });
  });
});
