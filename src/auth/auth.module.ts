import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: "test",
      signOptions: { expiresIn: '30d' },
    })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
