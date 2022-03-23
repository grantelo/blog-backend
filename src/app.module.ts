import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./users/entities/user.entity";
import {ConfigModule} from "@nestjs/config";
import { TokensModule } from './tokens/tokens.module';
import {Token} from "./tokens/entities/token.entity";
import { MailModule } from './mail/mail.module';
import { PostModule } from './post/post.module';
import {Post} from "./post/entities/post.entity";
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import {CloudinaryService} from "./cloudinary/cloudinary.service";
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/entities/comment.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: '1111',
            database: 'blog',
            entities: [User, Token, Post, Comment],
            synchronize: true,
        }),
        UsersModule,
        AuthModule,
        TokensModule,
        MailModule,
        PostModule,
        CloudinaryModule,
        CommentModule,
    ],
    controllers: [AppController],
    providers: [AppService,  CloudinaryService],
})
export class AppModule {
}
