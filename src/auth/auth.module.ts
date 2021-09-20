import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import {JwtStrategy} from "./strategies/jwt.strategy";
import {TokensModule} from "../tokens/tokens.module";
import {AuthController} from "./auth.controller";

@Module({
  imports: [
    UsersModule,
    TokensModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
