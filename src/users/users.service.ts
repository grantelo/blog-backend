import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {LoginUserDto} from "./dto/login-user.dto";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {from, Observable, of} from "rxjs";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private repository: Repository<User>
    ) {
    }

    create(dto: CreateUserDto) {
        return this.repository.save(dto)
    }

    findAll() {
        return `This action returns all users`;
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    findByCondition(condition: Object) {
        return this.repository.findOne(condition)
    }

    /*findByEmailWithUnselected(email: string) {
        return this.repository
            .createQueryBuilder("user")
            .where("email = :email", {email: email})
            .ad
            .getOne()
    }*/

    update(id: number, updateUserDto: UpdateUserDto) {
        return this.repository.update(id, updateUserDto)
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
