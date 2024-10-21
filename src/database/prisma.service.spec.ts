// prisma.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call $connect method', async () => {
      const $connectSpy = jest
        .spyOn(prismaService, '$connect')
        .mockResolvedValueOnce();

      await prismaService.onModuleInit();

      expect($connectSpy).toHaveBeenCalledTimes(1);
    });
  });
});
