import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {UsersModule} from '../users/users.module';
import {PassportModule} from '@nestjs/passport';
import {LocalStrategy} from './strategies/local.strategy';
import {JwtStrategy} from "./strategies/jwt.strategy";
import {TokensModule} from "../tokens/tokens.module";
import {AuthController} from "./auth.controller";
import {MailModule} from "../mail/mail.module";
import {RefreshJwtStrategy} from "./strategies/refreshJwt.strategy";
import {TokensService} from "../tokens/tokens.service";

@Module({
    imports: [
        UsersModule,
        TokensModule,
        PassportModule,
        MailModule
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, RefreshJwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
