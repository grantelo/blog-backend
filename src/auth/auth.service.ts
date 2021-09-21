import {ConflictException, Injectable, InternalServerErrorException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {v4} from 'uuid';
import {UsersService} from "../users/users.service";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {TokensService} from "../tokens/tokens.service";
import {IToken} from "../tokens/interfaces/token.interface";
import {MailService} from "../mail/mail.service";


@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private tokenService: TokensService,
        private mailService: MailService
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

            const activationLink = v4()
            const hashPassword = await bcrypt.hash(dto.password, 3)
            this.mailService.sendActivationMail(dto.email, activationLink)

            const {password, ...userData} = await this.userService.create({...dto, password: hashPassword, activationLink})

            console.log(await this.userService.findByCondition({id: userData.id}))

            return {
                ...userData,
                ...this.tokenService.generateJwtTokens(userData)
            }
        } catch (err) {
            console.log(err)
            if(!(err instanceof ConflictException))
                throw new InternalServerErrorException("Ошибка при регистрации")

            throw err
        }
    }
}
