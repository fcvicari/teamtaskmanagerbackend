import { IsNotEmpty } from 'class-validator';

export class SingInDTO {
  @IsNotEmpty({ message: 'Email is mandatory.' })
  email: string;

  @IsNotEmpty({ message: 'Password is mandatory.' })
  password: string;
}
