import { IsNotEmpty } from 'class-validator';

export class ChangePasswordUserDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  repeatNewPassword: string;
}
