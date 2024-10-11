import { Users } from '@prisma/client';
import { UserRepository } from '../../src/user/user.repository';

export const userMock = [
  {
    id: '1',
    name: 'Jonh Doe',
    email: 'jonhdoe@jonhdoe.com',
    password: '12345',
    avatar: null,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Jonh Doe',
    email: 'jonhdoe1@jonhdoe.com',
    password: '12345',
    avatar: null,
    active: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
] as Users[];

export const userServiceMock = {
  provide: UserRepository,
  useValue: {
    create: jest.fn().mockResolvedValue(userMock[0]),
    activateUser: jest.fn().mockResolvedValue(true),
    getUniqueById: jest.fn().mockResolvedValue(true),
    findByEmail: jest.fn().mockImplementation(({ email }) => {
      const user = userMock.filter((user) => user.email === email);
      if (user[0]) {
        return Promise.resolve(user[0]);
      } else {
        return Promise.resolve(null); // ou uma promessa rejeitada, dependendo do seu caso de uso
      }
    }),
    alterPassword: jest.fn().mockResolvedValue(true),
    update: jest.fn().mockResolvedValue(true),
    delete: jest.fn().mockResolvedValue(true),
  },
};
