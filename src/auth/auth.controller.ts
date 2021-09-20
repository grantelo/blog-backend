import {Body, Controller, Get, Post, Request, UseGuards} from "@nestjs/common";
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
    register(@Body() dto: CreateUserDto) {
        return this.authService.register(dto)
    }
}