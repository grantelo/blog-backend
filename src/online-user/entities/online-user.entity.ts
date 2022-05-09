import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OnlineUser {
    @PrimaryGeneratedColumn()
    id: number

    @Column({default: 0})
    countTabs: number

    @OneToOne(() => User)
    @JoinColumn()
    user: User
}
