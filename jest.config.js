/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  resolver: 'jest-ts-webcompat-resolver',
  coveragePathIgnorePatterns: [
    'src/repos/users/users.mongo.model.ts',
    'src/repos/skins/skins.mongo.model.ts',
    'src/repos/repo.ts',
    'src/app.ts',
    'src/index.ts',
    'src/routers/users.router.ts',
  ],
};
