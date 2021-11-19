import {Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {Injectable, Res, UnauthorizedException} from '@nestjs/common';
import {Request, Response} from "express"
import {AuthService} from "../auth.service";

const cookieExtractor = (request: Request): string | undefined => {
    return request.cookies["refreshToken"]
};

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, "refreshJwt") {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: cookieExtractor,
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true
        });
    }

    async validate(req: Request, payload: any, @Res() res: Response) {
        let {iat, sub, exp, ...user} = payload
        user = this.authService.validateRefreshToken(payload, req.cookies["refreshToken"])

        if(!user) throw new UnauthorizedException()

        return user
    }
}