import { Dialog } from "src/dialog/entities/dialog.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    text: string

    @ManyToOne(() => Dialog, dialog => dialog.messages)
    dialog: Dialog

    @ManyToOne(() => User, user => user.messages)
    user: User

    @Column({default: false})
    read: boolean
    
}
