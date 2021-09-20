import {ConflictException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {TokensService} from "../tokens/tokens.service";
import {IToken} from "../tokens/interfaces/token.interface";


@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private tokenService: TokensService
    ) {}

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

    async login(user: any) {
        const {password, ...userData} = user;

        const tokens: IToken = this.tokenService.generateJwtTokens(userData)

        return {
            ...userData,
            token: this.tokenService.generateJwtTokens(userData)
        }
    }


    async register(dto: CreateUserDto) {
        try {
            const candidate = await this.userService.findByCondition({email: dto.email})

            if(candidate) {
                throw new ConflictException("Пользователь с таким email уже существует")
            }

            const {password, ...userData} = await this.userService.create(dto)

            return {
                ...userData,
                token: this.tokenService.generateJwtTokens(userData)
            }
        } catch (err) {
            console.log(err)
            if(!(err instanceof ConflictException))
                throw new InternalServerErrorException("Ошибка при регистрации")

            throw err
        }
    }
}
