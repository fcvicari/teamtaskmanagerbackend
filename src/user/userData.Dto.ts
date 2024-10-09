import { IsNotEmpty } from 'class-validator';

export class UserDataDTO {
  @IsNotEmpty({ message: 'Name is mandatory.' })
  name: string;

  @IsNotEmpty({ message: 'Email is mandatory.' })
  email: string;

  avatar?: string;
}
