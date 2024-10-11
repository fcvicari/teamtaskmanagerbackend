import { Test, TestingModule } from '@nestjs/testing';
import { jwtServiceMock } from '../../test/mocks/jwtService.mock';
import { passwordHashMock } from '../../test/mocks/password.hash.mock';
import {
  userMock,
  userServiceMock,
} from '../../test/mocks/user.repository.mock';
import { PrismaService } from '../database/prisma.service';
import { SingInController } from './singin.controller';

describe('SinginController Tests', () => {
  let singinController: SingInController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [SingInController],
      providers: [
        jwtServiceMock,
        passwordHashMock,
        userServiceMock,
        {
          provide: PrismaService,
          useValue: {
            onModuleInit: jest.fn().mockImplementation(() => {
              return Promise.resolve(true);
            }),
          },
        },
      ],
    }).compile();

    singinController = moduleFixture.get<SingInController>(SingInController);
  });

  it('Should be defined', () => {
    expect(singinController).toBeDefined();
  });

  it('Login valid user', async () => {
    const result = await singinController.postSingIn({
      email: 'jonhdoe@jonhdoe.com',
      password: '12345',
    });

    expect(result.id).toEqual(userMock[0].id);
  });

  it('Login invalid user', async () => {
    await expect(
      singinController.postSingIn({
        email: 'invalidemail@jonhdoe.com',
        password: '12345',
      }),
    ).rejects.toHaveProperty('statusCode', 401);
  });

  it('Inactive user', async () => {
    await expect(
      singinController.postSingIn({
        email: 'jonhdoe1@jonhdoe.com',
        password: '12345',
      }),
    ).rejects.toHaveProperty('statusCode', 401);
  });

  it('Invalid password', async () => {
    await expect(
      singinController.postSingIn({
        email: 'jonhdoe@jonhdoe.com',
        password: 'InvalidPassword',
      }),
    ).rejects.toHaveProperty('statusCode', 401);
  });
});
