import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectID,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: ObjectID;

  @Column()
  type: string;

  @Column()
  token: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
