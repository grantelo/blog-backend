import {Body, Injectable} from '@nestjs/common';
import {ObjectID, Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {IToken} from "./interfaces/token.interface";
import {Token} from "./entities/token.entity"
import {InjectRepository} from "@nestjs/typeorm";
import {use} from "passport";

@Injectable()
export class TokensService {

  constructor(
      @InjectRepository(Token)
      private repository: Repository<Token>,
      private jwtService: JwtService
  ) {}

    create(userId: number, refreshToken: string) {
      return this.repository.save({user: {id: userId}, refreshToken})
  }

  generateJwtTokens(data): IToken  {
    const payload = {...data, sub: data.id}
    const accessToken = this.jwtService.sign(payload, {expiresIn: 60 * 15, secret: process.env.JWT_ACCESS_SECRET, })
    const refreshToken = this.jwtService.sign(payload, {expiresIn: "30d", secret: process.env.JWT_REFRESH_SECRET,})

    return {
      accessToken,
      refreshToken
    }
  }

  findOne(condition: Object) {
    return this.repository.findOne(condition)
  }

  async updateOrCreate(userId: number, refreshToken: string) {
    const tokenData = await this.findOne({user: userId})
    console.log("dasdsnajsadsgasadgaydsagdsaygdy")

    if(tokenData) {
      console.log("work")
      tokenData.refreshToken = refreshToken
      await this.repository.save(tokenData)
      return tokenData
    }

    console.log("now working")

    return this.repository.save({refreshToken, user: {id: userId}})
  }

  remove(refreshToken: string) {
    return this.repository.delete({refreshToken})
  }
}
