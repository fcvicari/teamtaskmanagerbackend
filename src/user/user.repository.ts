import { Injectable } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UsersCreateInput): Promise<Users> {
    return await this.prisma.users.create({
      data,
    });
  }

  async activateUser(id: string): Promise<Users> {
    return await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        active: true,
      },
    });
  }

  async findByEmail(where: Prisma.UsersWhereUniqueInput): Promise<Users> {
    return await this.prisma.users.findUnique({
      where,
    });
  }

  async alterPassword(id: string, password: string): Promise<Users> {
    return await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
  }
}
