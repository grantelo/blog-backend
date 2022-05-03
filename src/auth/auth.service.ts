import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { TokensService } from '../tokens/tokens.service';
import { MailService } from '../mail/mail.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/entities/user.entity';
import { IToken } from '../tokens/interfaces/token.interface';
import { TokenType } from '../tokens/enums/token.enum';
import { ChangePasswordUserDto } from '../users/dto/change-password-user.dto';
import { ResetPasswordUserDto } from '../users/dto/reset-password-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokenService: TokensService,
    private mailService: MailService,
  ) {}

  async validateUser(dto: LoginUserDto) {
    const user = await this.userService.findByCondition({
      select: ['id', 'fullName', 'email', 'password', 'isActivated'],
      where: { email: dto.email },
    });

    if (!user) return null;

    const isPassEqual = await bcrypt.compare(dto.password, user.password);

    if (!isPassEqual) return null;

    const { password, ...result } = user;

    return result;
  }

  async validateRefreshToken(user, refreshToken: string) {
    console.log(refreshToken);

    const token = await this.tokenService.findOne({
      token: refreshToken,
      type: TokenType.REFRESH_TOKEN,
    });

    console.log(token);

    if (!token) return null;

    console.log('dsadasdkjsidsadjsadusiagdsadtsafdytsafdsayt');

    const tokens: IToken = this.tokenService.generateJwtTokens(user);
    await this.tokenService.updateOrCreate(
      user.id,
      tokens.refreshToken,
      TokenType.REFRESH_TOKEN,
    );

    return {
      user,
      ...tokens,
    };
  }

  async validateToken(user, token: string) {
    const candidateToken = await this.tokenService.findOne({
      token,
      type: TokenType.FORGOT_PASSWORD,
    });

    if (!candidateToken) throw new UnauthorizedException();
  }

  async login(user: User) {
    const tokens: IToken = await this.tokenService.generateJwtTokens(user);
    console.log(tokens);
    await this.tokenService.updateOrCreate(
      user.id,
      tokens.refreshToken,
      TokenType.REFRESH_TOKEN,
    );

    return {
      user,
      ...tokens,
    };
  }

  async register(dto: CreateUserDto) {
    const candidate = await this.userService.findByCondition({
      email: dto.email,
    });

    if (candidate) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const activationLink = v4();
    console.log(dto);
    const hashPassword = await bcrypt.hash(dto.password, 3);
    await this.mailService.sendActivationMail(
      dto.email,
      `${process.env.API_URL}/auth/activation/` + activationLink,
    );

    const { password, ...userData } = await this.userService.create({
      ...dto,
      password: hashPassword,
      activationLink,
    });

    const tokens: IToken = this.tokenService.generateJwtTokens(userData);

    await this.tokenService.create(
      userData.id,
      TokenType.REFRESH_TOKEN,
      tokens.refreshToken,
    );

    return {
      user: userData,
      ...tokens,
    };
  }

  async activation(activationLink: string) {
    const user = await this.userService.findByCondition({ activationLink });

    if (!user) {
      throw new BadRequestException('Некорректная ссылка активации');
    }

    user.isActivated = true;
    await this.userService.update(user.id, user);
  }

  async changePassword(userId: number, dto: ChangePasswordUserDto) {
    const { password, newPassword, repeatNewPassword } = dto;

    if (password === newPassword)
      return new BadRequestException(
        'Новый пароль должен быть отличным от прежнего',
      );

    if (newPassword !== repeatNewPassword)
      return new BadRequestException('Пароли не совпадают');

    const hashPassword = await bcrypt.hash(dto.password, 3);

    await this.userService.update(userId, { password: hashPassword });
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByCondition({ email });

    if (!user)
      return new NotFoundException('Пользователь с указанным email не найден');

    const token = this.tokenService.generateForgotToken({ ...user });

    await this.tokenService.create(user.id, TokenType.FORGOT_PASSWORD, token);

    await this.mailService.sendResetPasswordMail(
      user.email,
      `${process.env.CLIENT_URL}/auth/reset-password?token=` + token,
    );
  }

  async resetPassword(
    userId: number,
    token: string,
    dto: ResetPasswordUserDto,
  ) {
    await this.changePassword(userId, dto);
    await this.tokenService.delete(token);
  }
}
