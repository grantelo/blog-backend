import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Param } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class ResetPasswordStrategy extends PassportStrategy(
  Strategy,
  'reset-password',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_FORGOT_SECRET,
    });
  }

  async validate(@Param('token') token: string, payload: any) {
    const { iat, exp, sub, ...user } = payload;

    await this.authService.validateToken(user, token);

    return user;
  }
}
