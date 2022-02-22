import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Post} from "./entities/post.entity";
import {CloudinaryService} from "../cloudinary/cloudinary.service";

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService, CloudinaryService],
  exports: [PostService]
})
export class PostModule {}
