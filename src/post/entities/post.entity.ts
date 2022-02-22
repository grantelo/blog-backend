import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "../../users/entities/user.entity";
import {OutputBlockData} from "../dto/create-post.dto";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User

    @Column()
    title: string

    @Column({ type: "jsonb" })
    body: OutputBlockData[];

    @Column({
        default: 0
    })
    views: number

    @Column("text",{nullable: true})
    tags?: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

}
