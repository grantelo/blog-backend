import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { UniqueOnDatabase } from '../../auth/validations/UniqueValidation';
import { User } from '../entities/user.entity';
import { Column } from 'typeorm';

export class CreateUserDto {
  @Length(3)
  fullName: string;

  @UniqueOnDatabase(User, {
    message: 'Пользователь с таким email уже существует',
  })
  @IsEmail(undefined, { message: 'Неверная почта' })
  email: string;

  activationLink = '';

  @Length(6, 32, { message: 'Пароль должен быть длинной от 6 до 32 символов' })
  password: string;
}
