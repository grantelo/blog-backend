import { IsNotEmpty } from 'class-validator';

export class CreateLikeDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  postId: number;
}
