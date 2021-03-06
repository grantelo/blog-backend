import { Response } from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refreshJwt-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ChangePasswordUserDto } from '../users/dto/change-password-user.dto';
import { ResetPasswordUserDto } from '../users/dto/reset-password-user.dto';
import { ResetPasswordAuthGuard } from './guards/reset-password-auth.guard';
import { AuthUnauthorizedExceptionFilter } from './auth.filter';
import { ForgotPasswordUserDto } from '../users/dto/forgot-password-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Res({ passthrough: true }) response: Response, @Req() req) {
    const user = await this.authService.login(req.user.id);
    response.cookie('refreshToken', user.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });
    return user;
  }

  @Post('register')
  async register(
    @Res({ passthrough: true }) response: Response,
    @Body() dto: CreateUserDto,
  ) {
    const user = await this.authService.register(dto);
    response.cookie('refreshToken', user.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });
    return user;
  }

  @Get('activation/:link')
  async activation(
    @Res({ passthrough: true }) response: Response,
    @Param('link') link: string,
  ) {
    await this.authService.activation(link);
    response.redirect(process.env.CLIENT_URL);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Get('refresh')
  refresh(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req, @Body() dto: ChangePasswordUserDto) {
    this.authService.changePassword(req.user.id, dto);
  }

  @Post('forgot-password')
  async forgotPassword(@Res() res, @Body() dto: ForgotPasswordUserDto) {
    await this.authService.forgotPassword(dto.email);
    res.json({
      message: '???????????? ?????? ???????????? ???????????? ???????????????????? ???? ?????????????????? email',
    });
  }

  @UseGuards(ResetPasswordAuthGuard)
  @UseFilters(AuthUnauthorizedExceptionFilter)
  @Post('reset-password')
  async resetPassword(
    @Req() req,
    @Param('token') token: string,
    @Body() dto: ResetPasswordUserDto,
  ) {
    await this.authService.resetPassword(req.user.id, token, dto);
  }
}
