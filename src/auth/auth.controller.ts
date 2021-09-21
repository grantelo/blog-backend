import {Response} from "express";
import {Body, Controller, Get, Post, Request, Res, UseGuards} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {CreateUserDto} from "../users/dto/create-user.dto";
import {LocalAuthGuard} from "./guards/local-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post("login")
    login(@Request() req) {
        return this.authService.login(req.user)
    }

    @Post("register")
    async register(@Res({ passthrough: true }) response: Response, @Body() dto: CreateUserDto) {
        const user = await this.authService.register(dto)
        response.cookie('refreshToken', user.refreshToken, {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true})
        return user
    }
}