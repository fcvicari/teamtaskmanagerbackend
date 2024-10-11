import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from './prisma.service';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $connect: jest.fn(),
    })),
  };
});

describe('PrismaService Test', () => {
  let prismaService: PrismaService;
  let prismaClientMock: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    prismaClientMock = new PrismaClient(); // mockado pelo jest
  });

  it('Call $connect in the onModuleInit method', async () => {
    await prismaService.onModuleInit();

    expect(prismaClientMock.$connect).toHaveBeenCalled();
  });
});
