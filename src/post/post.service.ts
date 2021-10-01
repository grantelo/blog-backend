import {Injectable, NotFoundException} from '@nestjs/common';
import {CreatePostDto} from './dto/create-post.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import {Repository} from "typeorm";
import {Post} from "./entities/post.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly repository: Repository<Post>
    ) {
    }

    create(userId: number, createPostDto: CreatePostDto) {
        return this.repository.save({
            user: {id: userId},
            ...createPostDto,
        })
    }

    findAll() {
        return this.repository.find({
            order: {
                createdAt: "DESC"
            }
        })
    }

    async searchByTag(tag: string) {
        const qb = this.repository
            .createQueryBuilder("posts")
            .where(':tag = ANY (posts.tags)', {tag})

        qb.limit(10)

        const [items, total] = await qb.getManyAndCount()

        return {
            items,
            total
        }
    }

    async popular() {
        const qb = this.repository
            .createQueryBuilder("posts")

        qb.orderBy("views", "DESC")
        qb.limit(10)

        const [items, total] = await qb.getManyAndCount()

        return {
            items,
            total
        }
    }

    async search(body: string) {
        const qb = this.repository
            .createQueryBuilder("posts")
            .where("posts.body ILIKE :body", {body})

        qb.orderBy("views", "DESC")
        qb.limit(10)

        const [items, total] = await qb.getManyAndCount()

        return {
            items,
            total
        }
    }

    async findOne(id: number) {
        return this.repository
            .createQueryBuilder("posts")
            .where("id = :id", {id})
            .limit()
            .update()
            .set({views: () => "views + 1"})
            .execute()
    }

    async update(id: number, updatePostDto: UpdatePostDto) {
        const post = await this.repository.findOne(id)

        if (!post) throw new NotFoundException("Пост не найден")

        return this.repository.update(id, updatePostDto)
    }

    async remove(id: number) {
        const post = await this.repository.findOne(id)

        if (!post) throw new NotFoundException("Пост не найден")

        return this.repository.delete(id)
    }
}
