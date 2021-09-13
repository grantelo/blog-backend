import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import {JwtAuthGuard} from "./auth/guards/jwt-auth.guard";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
