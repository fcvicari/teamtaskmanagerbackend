import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './database/prisma.service';
import { SingInController } from './singin/singin.controller';
import { SingupController } from './singup/singup.controller';
import { UserController } from './user/user.controller';
import { UserRepository } from './user/user.repository';
import { UserTokenRepository } from './user/userToken.repository';
import { PasswordHash } from './utils/password.hash';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [SingupController, SingInController, UserController],
  providers: [PasswordHash, PrismaService, UserRepository, UserTokenRepository],
})
export class AppModule {}
