import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail(null, { message: 'Некорректный адрес электроной почты' })
  email: string;

  @IsNotEmpty()
  password: string;
}
