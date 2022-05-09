import { PartialType } from '@nestjs/mapped-types';
import { CreateOnlineUserDto } from './create-online-user.dto';

export class UpdateOnlineUserDto extends PartialType(CreateOnlineUserDto) {}
