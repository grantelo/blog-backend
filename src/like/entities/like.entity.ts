import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../post/entities/post.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes, { eager: true, primary: true })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Post, (post) => post.likes, { eager: true, primary: true })
  @JoinColumn()
  post: Post;
}
