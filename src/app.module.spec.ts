import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { PrismaService } from './database/prisma.service';
import { SingInController } from './singin/singin.controller';
import { SingupController } from './singup/singup.controller';
import { UserController } from './user/user.controller';
import { UserRepository } from './user/user.repository';
import { UserTokenRepository } from './user/userToken.repository';
import { PasswordHash } from './utils/password.hash';

describe('AppModule Test', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '12h' },
        }),
        AppModule,
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should register SingupController', () => {
    const singupController = moduleRef.get<SingupController>(SingupController);
    expect(singupController).toBeDefined();
  });

  it('should register SingInController', () => {
    const singinController = moduleRef.get<SingInController>(SingInController);
    expect(singinController).toBeDefined();
  });

  it('should register UserController', () => {
    const userController = moduleRef.get<UserController>(UserController);
    expect(userController).toBeDefined();
  });

  it('should register PasswordHash provider', () => {
    const passwordHash = moduleRef.get<PasswordHash>(PasswordHash);
    expect(passwordHash).toBeDefined();
  });

  it('should register PrismaService provider', () => {
    const prismaService = moduleRef.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
  });

  it('should register UserRepository provider', () => {
    const userRepository = moduleRef.get<UserRepository>(UserRepository);
    expect(userRepository).toBeDefined();
  });

  it('should register UserTokenRepository provider', () => {
    const userTokenRepository =
      moduleRef.get<UserTokenRepository>(UserTokenRepository);
    expect(userTokenRepository).toBeDefined();
  });
});
