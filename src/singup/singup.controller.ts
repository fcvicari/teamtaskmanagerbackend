import { Body, Controller, Post, Query } from '@nestjs/common';
import { differenceInHours } from 'date-fns';
import { UserDTO } from '../user/user.Dto';
import { UserRepository } from '../user/user.repository';
import { UserTokenRepository } from '../user/userToken.repository';
import { AppError } from '../utils/app.erro';
import { PasswordHash } from '../utils/password.hash';

@Controller()
export class SingupController {
  constructor(
    private user: UserRepository,

    private hash: PasswordHash,

    private userToken: UserTokenRepository,
  ) {}

  @Post('singup')
  async postNewUser(@Body() body: UserDTO) {
    const { email, name, password, avatar } = body;

    const userExists = await this.user.findByEmail({ email });
    if (userExists) {
      throw new AppError('This email is already used by another user.', 400);
    }

    const hasPassword = await this.hash.generateHash(password);

    const userCreated = await this.user.create({
      name,
      email,
      password: hasPassword,
      avatar,
      active: false,
    });

    await this.userToken.create({
      user: {
        connect: userCreated,
      },
    });

    return {
      ...userCreated,
      password: undefined,
    };
  }

  @Post('activate')
  async postActivateUser(@Query() query) {
    const { token } = query;

    const userToken = await this.userToken.findById({ id: token });
    if (userToken) {
      if (differenceInHours(Date.now(), userToken.createdAt) > 2) {
        throw new AppError('Token expired.');
      }

      const user = await this.user.activateUser(userToken.userID);

      await this.userToken.deleteAll({
        userID: userToken.userID,
      });

      return { ...user, password: undefined };
    }

    return null;
  }

  @Post('alterpass')
  async postAlterPassword(@Body() body, @Query() query) {
    const { token } = query;
    const { password } = body;

    const userToken = await this.userToken.findById({ id: token });

    if (differenceInHours(Date.now(), userToken.createdAt) > 2) {
      throw new AppError('Token expired.');
    }

    const newPassword = await this.hash.generateHash(password);

    await this.user.alterPassword(userToken.userID, newPassword);

    await this.userToken.deleteAll({
      userID: userToken.userID,
    });

    return null;
  }

  @Post('recoverpass')
  async postRecoverPassword(@Body() body) {
    const { email } = body;

    const userExists = await this.user.findByEmail({ email });
    if (userExists) {
      await this.userToken.deleteAll({
        userID: userExists.id,
      });

      await this.userToken.create({
        user: {
          connect: userExists,
        },
      });

      //sendEmailActivate(userToken.id);
    }

    return null;
  }
}
