import {Module} from '@nestjs/common';
import {TokensService} from './tokens.service';
import {JwtModule} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Token} from "./entities/token.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Token]),
        JwtModule.register({})
    ],
    providers: [TokensService],
    exports: [TokensService]
})
export class TokensModule {}
