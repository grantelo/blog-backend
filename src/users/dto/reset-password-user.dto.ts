import { OmitType } from '@nestjs/mapped-types';
import { ChangePasswordUserDto } from './change-password-user.dto';

export class ResetPasswordUserDto extends OmitType(ChangePasswordUserDto, ['password']) {}
