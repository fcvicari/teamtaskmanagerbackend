import { Body, Controller, Post } from '@nestjs/common';
import { UserDTO } from 'src/user/user.Dto';
import { UserRepository } from 'src/user/user.repository';
import { AppError } from 'src/utils/app.erro';
import { PasswordHash } from 'src/utils/password.hash';

@Controller('singup')
export class SingupController {
  constructor(
    private user: UserRepository,

    private hash: PasswordHash,
  ) {}

  @Post()
  async postNewUser(@Body() body: UserDTO) {
    const { email, name, password, avatar } = body;

    const userExists = await this.user.findByEmail({ email });
    if (userExists) {
      throw new AppError('This email is already used by another user.', 400);
    }

    const hasPassword = await this.hash.generateHash(password);

    const userCreated = await this.user.create({
      email,
      name,
      password: hasPassword,
      avatar,
    });
    return {
      ...userCreated,
      password: undefined,
    };
  }
}
