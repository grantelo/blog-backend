import {Response} from "express";
import {Body, Controller, Get, Param, Post, Req, Res, UseGuards} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {RefreshJwtAuthGuard} from "./guards/refreshJwt-auth.guard";
import {TokensService} from "../tokens/tokens.service";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly tokenService: TokensService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@Res({ passthrough: true }) response: Response, @Req() req) {
        const user = await this.authService.login(req.user)
        response.cookie('refreshToken', user.refreshToken, {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true})
        return user
    }

    @Post("register")
    async register(@Res({ passthrough: true }) response: Response, @Body() dto: CreateUserDto) {
        const user = await this.authService.register(dto)
        response.cookie('refreshToken', user.refreshToken, {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true})
        return user
    }



    @Get("activation/:link")
    async activation(@Res({ passthrough: true }) response: Response, @Param("link") link: string) {
        await this.authService.activation(link)
        response.redirect(process.env.CLIENT_URL)
    }

    @UseGuards(RefreshJwtAuthGuard)
    @Get("refresh")
    refresh(@Req() req, @Body() body) {

    }
}