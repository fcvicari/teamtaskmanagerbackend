import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/database/prisma.service';
import { UserRepository } from './user.repository';

describe('UserRepository Tests', () => {
  let userRepository: UserRepository;
  let prismaService: PrismaService;

  const mockPrismaService = {
    users: {
      create: jest
        .fn()
        .mockImplementation(({ name, email, password, avatar }) => {
          return Promise.resolve({
            id: 'idNewUser',
            name,
            email,
            password,
            avatar,
            active: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }),
      update: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('Create user', async () => {
    const userData = {
      email: 'newjonhdoe@jonhdoe.com',
      password: 'jonhdoe1234',
      name: 'Jonh Doe New User',
      active: false,
    };

    const newUser = await userRepository.create(userData);

    expect(newUser.id).not.toBeNull();
    expect(newUser.id).toEqual('idNewUser');
  });

  it('User activation', async () => {
    const userData = {
      id: 'userID',
      email: 'newjonhdoe@jonhdoe.com',
      password: 'jonhdoe1234',
      name: 'Jonh Doe New User',
      active: true,
    };

    mockPrismaService.users.update.mockResolvedValue(userData);

    const user = await userRepository.activateUser('userID');

    expect(user.id).toEqual(userData.id);
    expect(user.active).toEqual(userData.active);
  });

  it('Get user by ID', async () => {
    const userData = {
      id: 'userID',
      email: 'newjonhdoe@jonhdoe.com',
      password: 'jonhdoe1234',
      name: 'Jonh Doe New User',
      active: true,
    };

    mockPrismaService.users.findUnique.mockResolvedValue(userData);

    const user = await userRepository.getUniqueById({ id: 'userID' });

    expect(user.id).toEqual(userData.id);
  });

  it('Find user by e-mail', async () => {
    const userData = {
      id: 'userID',
      email: 'jonhdoe@jonhdoe.com',
      password: 'jonhdoe1234',
      name: 'Jonh Doe New User',
      active: true,
    };

    mockPrismaService.users.findUnique.mockResolvedValue(userData);

    const user = await userRepository.findByEmail({
      email: 'jonhdoe@jonhdoe.com',
    });

    expect(user.id).toEqual(userData.id);
  });

  it('Alter password', async () => {
    const userData = {
      id: 'userID',
      email: 'jonhdoe@jonhdoe.com',
      password: 'jonhdoe1234',
      name: 'Jonh Doe New User',
      active: true,
    };

    mockPrismaService.users.update.mockResolvedValue(userData);

    const user = await userRepository.alterPassword('userID', 'jonhdoe1234');

    expect(user.id).toEqual(userData.id);
  });

  it('Update user', async () => {
    const userData = {
      id: 'userID',
      email: 'jonhdoe@jonhdoe.com',
      password: 'jonhdoe1234',
      name: 'Jonh Doe New User',
      active: true,
    };

    mockPrismaService.users.update.mockResolvedValue(userData);

    const user = await userRepository.update({
      data: { ...userData },
      where: { id: 'userID' },
    });

    expect(user.id).toEqual(userData.id);
  });

  it('Delete user', async () => {
    mockPrismaService.users.delete.mockResolvedValue(null);

    await userRepository.delete({ id: 'userID' });

    expect(prismaService.users.delete).toHaveBeenCalledWith({
      where: { id: 'userID' },
    });
  });
});
