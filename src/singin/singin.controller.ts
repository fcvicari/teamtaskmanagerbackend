import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/user/user.repository';
import { AppError } from 'src/utils/app.erro';
import { PasswordHash } from 'src/utils/password.hash';
import { SingInDTO } from './singin.Dto';

const UnauthorizedUser = 'Unauthorized user.';

@Controller('singin')
export class SingInController {
  constructor(
    private user: UserRepository,

    private hash: PasswordHash,

    private jwtService: JwtService,
  ) {}

  @Post()
  async postNewUser(@Body() body: SingInDTO) {
    const { email, password } = body;

    const user = await this.user.findByEmail({ email });
    if (!user) {
      throw new AppError(UnauthorizedUser, 401);
    }

    const validPassword = await this.hash.compareHash(password, user.password);
    if (!validPassword) {
      throw new AppError(UnauthorizedUser, 401);
    }

    const payload = {
      name: user.name,
      email: user.email,
      id: user.id,
    };

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
