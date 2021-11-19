import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import {v4} from 'uuid';
import {UsersService} from '../users/users.service';
import {CreateUserDto} from '../users/dto/create-user.dto';
import {TokensService} from '../tokens/tokens.service';
import {MailService} from '../mail/mail.service';
import {LoginUserDto} from '../users/dto/login-user.dto';
import {User} from '../users/entities/user.entity';
import {IToken} from "../tokens/interfaces/token.interface";


@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private tokenService: TokensService,
        private mailService: MailService,
    ) {
    }

    async validateUser(dto: LoginUserDto) {
        const user = await this.userService.findByCondition({
            select: ["id", "fullName", "email", "password", "isActivated"],
            where: {email: dto.email}
        })

        if (!user) return null;

        const isPassEqual = await bcrypt.compare(dto.password, user.password);

        if (!isPassEqual) return null;

        const {password, ...result} = user;

        return result
    }

    async validateRefreshToken(user, refreshToken: string) {
        const token = this.tokenService.findOne({refreshToken})

        if (!token) throw new UnauthorizedException()

        const tokens: IToken = this.tokenService.generateJwtTokens(user)
        await this.tokenService.updateOrCreate(user.id, tokens.refreshToken)

        return {
            user,
            ...tokens
        }
    }

    async login(user: User) {
        const tokens: IToken = await this.tokenService.generateJwtTokens(user)
        await this.tokenService.updateOrCreate(user.id, tokens.refreshToken)

        return {
            ...user,
            ...tokens
        }
    }


    async register(dto: CreateUserDto) {
        const candidate = await this.userService.findByCondition({email: dto.email});

        if (candidate) {
            throw new ConflictException('Пользователь с таким email уже существует');
        }

        const activationLink = v4();
        console.log(dto)
        const hashPassword = await bcrypt.hash(dto.password, 3);
        await this.mailService.sendActivationMail(dto.email, `${process.env.CLIENT_URL}/auth/activation/` + activationLink);

        const {password, ...userData} = await this.userService.create({
            ...dto,
            password: hashPassword,
            activationLink,
        });

        const tokens: IToken = this.tokenService.generateJwtTokens(userData)

        await this.tokenService.create(userData.id, tokens.refreshToken)

        return {
            ...userData,
            ...tokens,
        };
    }

    async activation(activationLink: string) {
        const user = await this.userService.findByCondition({activationLink})

        if (!user) {
            throw new BadRequestException("Некорректная ссылка активации")
        }

        user.isActivated = true
        this.userService.update(user.id, user)
    }

}
