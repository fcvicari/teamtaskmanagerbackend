import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class UserDTO {
  @IsNotEmpty({ message: 'Name is mandatory.' })
  name: string;

  @IsNotEmpty({ message: 'Email is mandatory.' })
  email: string;

  @IsNotEmpty({ message: 'Password is mandatory.' })
  @MinLength(8, { message: 'The password must be at least 8 characters long.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must contain uppercase, lowercase letters and numbers.',
  })
  password: string;

  avatar?: string;
}
