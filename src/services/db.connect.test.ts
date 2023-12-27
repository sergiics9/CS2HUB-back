import mongoose from 'mongoose';
import { dbConnect } from './db.connect';
jest.mock('mongoose');

describe('Given dbConnect Function', () => {
  describe('When we run it', () => {
    test('It should call mongoose.connect', () => {
      mongoose.connect = jest.fn();
      dbConnect();
      expect(mongoose.connect).toHaveBeenCalled();
    });
  });
});
