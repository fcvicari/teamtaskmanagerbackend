import { Injectable } from '@nestjs/common';
import { Prisma, UsersToken } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UserTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UsersTokenCreateInput): Promise<UsersToken> {
    return await this.prisma.usersToken.create({
      data,
    });
  }

  async deleteAll(where: Prisma.UsersTokenWhereInput): Promise<null> {
    await this.prisma.usersToken.deleteMany({
      where,
    });

    return null;
  }

  async findById(
    where: Prisma.UsersTokenWhereUniqueInput,
  ): Promise<UsersToken> {
    return await this.prisma.usersToken.findUnique({
      where,
    });
  }
}
