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
    const token = await this.tokenService.findOne({
      token: refreshToken,
      type: TokenType.REFRESH_TOKEN,
    });

    if (!token) return null;

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

  async login(userId: number) {
    const user = await this.userService.findById(userId);
    const tokens: IToken = await this.tokenService.generateJwtTokens(user);
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
      throw new ConflictException('???????????????????????? ?? ?????????? email ?????? ????????????????????');
    }

    const activationLink = v4();
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
      throw new BadRequestException('???????????????????????? ???????????? ??????????????????');
    }

    user.isActivated = true;
    await this.userService.update(user.id, user);
  }

  async changePassword(userId: number, dto: ChangePasswordUserDto) {
    const { password, newPassword, repeatNewPassword } = dto;
    const user = await this.userService.findById(userId);

    if (!user) return new NotFoundException('?????????????? ???????????? ???? ??????????????');

    const isPassEqual = await bcrypt.compare(dto.password, user.password);

    if (!isPassEqual)
      return new BadRequestException('???????????? ???????????? ???????????? ???? ??????????!');

    if (password === newPassword)
      return new BadRequestException(
        '?????????? ???????????? ???????????? ???????? ???????????????? ???? ????????????????',
      );

    if (newPassword !== repeatNewPassword)
      return new BadRequestException('???????????? ???? ??????????????????');

    const hashPassword = await bcrypt.hash(dto.password, 3);

    await this.userService.update(userId, { password: hashPassword });
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByCondition({ email });

    if (!user)
      return new NotFoundException('???????????????????????? ?? ?????????????????? email ???? ????????????');

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
    const { newPassword, repeatNewPassword } = dto;

    if (newPassword !== repeatNewPassword)
      return new BadRequestException('???????????? ???? ??????????????????');

    const hashPassword = await bcrypt.hash(dto.newPassword, 3);

    await this.userService.update(userId, { password: hashPassword });
    await this.tokenService.delete(token);
  }
}
