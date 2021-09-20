import {Column, Entity, ObjectID, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {JoinColumn} from "typeorm";
import {User} from "../../users/entities/user.entity";

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id: ObjectID

    @Column()
    refreshToken: string

    @OneToOne(() => User)
    @JoinColumn()
    user: User
}
