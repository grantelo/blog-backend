import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  create(dto: CreateUserDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return `This action returns all users`;
  }

  findById(id: number) {
    return this.repository.findOne(id);
  }

  findByCondition(condition: Object) {
    return this.repository.findOne(condition);
  }

  /*findByEmailWithUnselected(email: string) {
        return this.repository
            .createQueryBuilder("user")
            .where("email = :email", {email: email})
            .ad
            .getOne()
    }*/
  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.repository.update(id, updateUserDto);

    return this.repository.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
