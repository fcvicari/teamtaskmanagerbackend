import { PasswordHash } from '../../src/utils/password.hash';

export const passwordHashMock = {
  provide: PasswordHash,
  useValue: {
    compareHash: jest.fn().mockImplementation(async (payload, hashed) => {
      return Promise.resolve(payload === hashed);
    }),
    generateHash: jest.fn().mockImplementation(async ({ payload }) => {
      return Promise.resolve(payload);
    }),
  },
};
