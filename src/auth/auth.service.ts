import {ForbiddenException, Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/create-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService
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

    async register(dto: CreateUserDto) {
        try {
            const {password, ...user} = await this.userService.create(dto)
            return {
                ...user,
                token: this.
            }
        }
        catch (err) {
            throw new ForbiddenException("Ошибка при регистрации")
        }
    }
}
