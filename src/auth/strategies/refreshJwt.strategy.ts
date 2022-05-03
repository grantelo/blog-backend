import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

const cookieExtractor = (request: Request): string | undefined => {
  return request.cookies['refreshToken'];
};

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refreshJwt',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    let { iat, sub, exp, ...user } = payload;

    user = await this.authService.validateRefreshToken(
      user,
      req.cookies['refreshToken'],
    );

    console.log(user);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
