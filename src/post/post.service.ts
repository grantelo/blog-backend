import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
  ) {}

  create(userId: number, createPostDto: CreatePostDto) {
    return this.repository.save({
      user: { id: userId },
      body: createPostDto.body,
      title: createPostDto.title,
      tags: createPostDto.tags ?? '',
    });
  }

  async new(userId?: number) {
    const t = await this.repository.query(
      'select * from (select\n' +
        '    distinct on (public.post.id) public.post.id,\n' +
        '    title,\n' +
        '    public.post."createdAt",\n' +
        '    "public".post.body,\n' +
        '    "public".post.tags,\n' +
        '    COUNT(public.like."postId") over(PARTITION by public.post.id) as "likesCount",\n' +
        '    COUNT(public.like."userId") filter(\n' +
        '        where\n' +
        '            "public"."like"."userId" = $1\n' +
        '    ) over(PARTITION by public.post.id) != 0 as isLike\n' +
        'from\n' +
        '    "public".post\n' +
        '    left join public.like on public.like."postId" = post.id) as t\n' +
        'order by "createdAt" desc\n',
      [userId],
    );
    // .createQueryBuilder('post')
    // .leftJoinAndMapOne('post.likes', 'post.likes', 'likes', 'likes')
    // //.leftJoinAndSelect('likes.user', 'user')
    // //.loadRelationCountAndMap('post.countLikes', 'post.likes')
    // .getMany();

    console.log(t);

    return t;
  }

  async searchByTag(tag: string) {
    const qb = this.repository
      .createQueryBuilder('posts')
      .where(':tag = ANY (posts.tags)', { tag });

    qb.limit(10);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
    };
  }

  async popular(userId?: number) {
    const t = await this.repository.query(
      'select * from (select\n' +
        '    distinct on (public.post.id) public.post.id,\n' +
        '    title,\n' +
        '    public.post."createdAt",\n' +
        '    "public".post.body,\n' +
        '    "public".post.tags,\n' +
        '    COUNT(public.like."postId") over(PARTITION by public.post.id) as "likesCount",\n' +
        '    COUNT(public.like."userId") filter(\n' +
        '        where\n' +
        '            "public"."like"."userId" = $1!\n' +
        '    ) over(PARTITION by public.post.id) != 0 as isLike\n' +
        'from\n' +
        '    "public".post\n' +
        '    left join public.like on public.like."postId" = post.id) as t\n' +
        'order by "likesCount" desc\n',
      [userId],
    );

    return t;

    // return this.repository.find({
    //   order: {
    //     createdAt: 'DESC',
    //   },
    // });

    // const qb = this.repository.createQueryBuilder('posts');
    //
    // qb.orderBy('views', 'DESC');
    // qb.limit(10);
    //
    // const [items, total] = await qb.getManyAndCount();
    //
    // return {
    //   items,
    //   total,
    // };
  }

  async search(body: string) {
    const qb = this.repository
      .createQueryBuilder('posts')
      .where('posts.title ilike :title', { title: `%${body}%` })
      .orWhere('posts.tags ilike :tags', { tags: `%${body}%` });
    // .limit(10);

    //qb.orderBy('views', 'DESC');

    const [items, total] = await qb.getManyAndCount();

    console.log('cccs');
    console.log(body);
    console.log({
      posts: items,
      totalCount: total,
    });

    return {
      posts: items,
      totalCount: total,
    };
  }

  async findOne(id: number) {
    await this.repository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .whereInIds(id)
      .update()
      .set({ views: () => 'views + 1' })
      .execute();

    return this.repository.findOne(id);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.repository.findOne(id);

    if (!post) throw new NotFoundException('Пост не найден');

    //return this.repository.update(id, updatePostDto)
  }

  async remove(id: number) {
    const post = await this.repository.findOne(id);

    if (!post) throw new NotFoundException('Пост не найден');

    return this.repository.delete(id);
  }
}
