import {ForbiddenException, Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {JwtService} from '@nestjs/jwt';
import {PickType} from '@nestjs/mapped-types';
import {use} from 'passport';
import _ from 'lodash';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByCondition({
            email,
            password,
        });

        if (user && user.password === password) {
            const {password, ...result} = user;
            return result;
        }

        return null;
    }

    generateJwtToken(data: { id: number, email: string }): string  {
        const payload = {email: data.email, sub: data.id}
        return this.jwtService.sign(payload)
    }

    async login(user: any) {
        const {password, ...userData} = user;

        return {
            ...userData,
            token: this.generateJwtToken(userData)
        }
    }


    async register(dto: CreateUserDto) {
        try {
            const {password, ...userData} = await this.userService.create(dto)
            return {
                ...userData,
                token: this.generateJwtToken(userData)
            }
        } catch (err) {
            throw new ForbiddenException("Ошибка при регистрации")
        }
    }
}
