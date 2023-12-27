import { Auth } from './auth';
import { TokenPayload } from '../types/token.payload.js';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Given Auth abstract class', () => {
  describe('When we use its methods', () => {
    test('Then hash should ...', () => {
      // Arrange
      (hash as jest.Mock).mockReturnValue('test');
      const mockValue = '';
      // Act
      const result = Auth.hash(mockValue);
      // Assert
      expect(hash).toHaveBeenCalled();
      expect(result).toBe('test');
    });

    test('Then compare should ...', () => {
      (compare as jest.Mock).mockReturnValue(true);
      const result = Auth.compare('', '');
      expect(compare).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    test('Then signJWT should ...', () => {
      jwt.sign = jest.fn().mockReturnValue('test');
      const result = Auth.signJWT({} as unknown as TokenPayload);
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toBe('test');
    });

    test('Then verifyAndGetPayload should ...', () => {
      jwt.verify = jest.fn().mockReturnValue({});
      const result = Auth.verifyAndGetPayload('');
      expect(jwt.verify).toHaveBeenCalled();
      expect(result).toStrictEqual({});
    });

    test('Then verifyAndGetPayload should throw an error', () => {
      jwt.verify = jest.fn().mockReturnValue('');
      expect(() => Auth.verifyAndGetPayload('')).toThrow();
      expect(jwt.verify).toHaveBeenCalled();
    });
  });
});
