import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOnlineUserDto } from './dto/create-online-user.dto';
import { UpdateOnlineUserDto } from './dto/update-online-user.dto';
import { OnlineUser } from './entities/online-user.entity';

@Injectable()
export class OnlineUserService {
  constructor(
    @InjectRepository(OnlineUser)
    private readonly repository: Repository<OnlineUser>
  ) {}

  create(createOnlineUserDto: CreateOnlineUserDto) {
    return this.repository.save({user: {id: createOnlineUserDto.userId}});
  }

  findAll() {
    return `This action returns all onlineUser`;
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, updateOnlineUserDto: UpdateOnlineUserDto) {
    return `This action updates a #${id} onlineUser`;
  }

  save(onlineUser: OnlineUser) {
    return this.repository.save(onlineUser)
  }

  remove(onlineUser: OnlineUser) {
    return this.repository.remove(onlineUser);
  }
}
