import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { AppError } from '../utils/app.erro';
import { PasswordHash } from '../utils/password.hash';
import { SingInDTO } from './singin.Dto';

const UnauthorizedUser = 'Unauthorized user.';
const AccountInactive =
  UnauthorizedUser + ' Your account is currently inactive.';

@Controller('singin')
export class SingInController {
  constructor(
    private user: UserRepository,

    private hash: PasswordHash,

    private jwtService: JwtService,
  ) {}

  @Post()
  async postSingIn(@Body() body: SingInDTO) {
    const { email, password } = body;

    const user = await this.user.findByEmail({ email });
    if (!user) {
      throw new AppError(UnauthorizedUser, 401);
    }

    if (!user.active) {
      throw new AppError(AccountInactive, 401);
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
