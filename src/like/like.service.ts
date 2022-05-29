import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';

import { Like } from './entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly repository: Repository<Like>,
  ) {}

  async create(createLikeDto: CreateLikeDto) {
    const dto = {
      user: { id: createLikeDto.userId },
      post: { id: createLikeDto.postId },
    };

    const like = await this.repository.findOne(dto);

    if (like) await this.repository.remove(like);
    else await this.repository.save(dto);

    const t = await this.repository.count();

    console.log('count: ');
    console.log(t);

    return t;
  }

  findAll() {
    return `This action returns all like`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  update(id: number, updateLikeDto: UpdateLikeDto) {
    return `This action updates a #${id} like`;
  }

  remove(id: number) {
    return `This action removes a #${id} like`;
  }
}
