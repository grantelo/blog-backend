import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { IToken } from './interfaces/token.interface';
import { Token } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private repository: Repository<Token>,
    private jwtService: JwtService,
  ) {}

  create(userId: number, type: string, token: string) {
    return this.repository.save({ user: { id: userId }, type, token });
  }

  generateJwtTokens(data): IToken {
    const payload = { ...data, sub: data.id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: 60 * 15,
      secret: process.env.JWT_ACCESS_SECRET,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_REFRESH_SECRET,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  generateForgotToken(user): string {
    return this.jwtService.sign(user, {
      expiresIn: 60 * 60 * 24,
      secret: process.env.JWT_FORGOT_SECRET,
    });
  }

  findOne(condition: Object) {
    return this.repository.findOne(condition);
  }

  async updateOrCreate(userId: number, token: string) {
    const tokenData = await this.findOne({ user: userId });

    if (tokenData) {
      tokenData.token = token;
      await this.repository.save(tokenData);
      return tokenData;
    }

    return this.repository.save({ token, user: { id: userId } });
  }

  delete(token: string) {
    return this.repository.delete({ token });
  }
}
