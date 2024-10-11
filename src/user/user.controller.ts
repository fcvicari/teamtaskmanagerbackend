import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserRepository } from '../user/user.repository';
import { UserTokenRepository } from '../user/userToken.repository';
import { AppError } from '../utils/app.erro';
import { PasswordHash } from '../utils/password.hash';
import { UserPasswordDTO } from './password.Dto';
import { UserDataDTO } from './userData.Dto';

const UserNotFound = 'User not found.';
const UserInactive = 'Inactive user.';
const InvalidPassword = 'The current password is not valid.';
const ChangePassword =
  'The current password and the new password cannot be the same.';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private user: UserRepository,

    private hash: PasswordHash,

    private userToken: UserTokenRepository,
  ) {}

  @Patch(':id')
  async updateUser(@Body() body: UserDataDTO, @Param('id') id: string) {
    const { email, name, avatar } = body;

    const userExists = await this.user.getUniqueById({ id });
    if (!userExists) {
      throw new AppError(UserNotFound, 400);
    }

    if (!userExists.active) {
      throw new AppError(UserInactive, 401);
    }

    userExists.avatar = avatar;
    userExists.name = name;
    userExists.email = email;
    userExists.updatedAt = new Date();

    const userUpdated = await this.user.update({
      where: { id },
      data: userExists,
    });

    return {
      ...userUpdated,
      password: undefined,
    };
  }

  @Put(':id')
  async changePasswordUser(
    @Body() body: UserPasswordDTO,
    @Param('id') id: string,
  ) {
    const { password, newPassword } = body;

    const userExists = await this.user.getUniqueById({ id });
    if (!userExists) {
      throw new AppError(UserNotFound, 400);
    }

    if (!userExists.active) {
      throw new AppError(UserInactive, 401);
    }

    if (password === newPassword) {
      throw new AppError(ChangePassword, 401);
    }

    const validPassword = await this.hash.compareHash(
      password,
      userExists.password,
    );
    if (!validPassword) {
      throw new AppError(InvalidPassword, 401);
    }

    userExists.password = await this.hash.generateHash(newPassword);
    userExists.updatedAt = new Date();

    const userUpdated = await this.user.update({
      where: { id },
      data: userExists,
    });

    return {
      ...userUpdated,
      password: undefined,
    };
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.user.delete({
      id,
    });
  }
}
