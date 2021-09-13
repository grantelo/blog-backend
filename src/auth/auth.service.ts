import {ForbiddenException, Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/create-user.dto";
import { JwtService } from '@nestjs/jwt';
import { PickType } from '@nestjs/mapped-types';
import { use } from 'passport';
import _ from 'lodash';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByCondition({
            email,
            password,
        });

        if (user && user.password === password) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async login(user: any) {
        const {password, ...userData} = user;

        return {
            ...userData,
            token: this.jwtService.sign(_.pick(userData, ["id", "email"]))
        }
    }

    // async register(dto: CreateUserDto) {
    //     try {
    //         const {password, ...user} = await this.userService.create(dto)
    //         return {
    //             ...user,
    //             token: this.
    //         }
    //     }
    //     catch (err) {
    //         throw new ForbiddenException("Ошибка при регистрации")
    //     }
    // }
}
