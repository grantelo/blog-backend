import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
  ) {}

  create(createCommentDto: CreateCommentDto, userId: number) {
    return this.repository.save({
      text: createCommentDto.text,
      post: { id: createCommentDto.postId },
      user: { id: userId },
    });
  }

  findAll(postId: number) {
    return this.repository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.post', 'post')
      .where('comment.post = :postId', { postId })
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.repository.findOne(id);

    if (!comment) throw new NotFoundException('Комментарий не найден');

    await this.repository.update(id, updateCommentDto);

    return this.repository.findOne({ id });
  }

  async remove(id: number) {
    const comment = await this.repository.findOne(id);

    if (!comment) throw new NotFoundException('Комментарий не найден');

    await this.repository.delete(id);
  }
}
