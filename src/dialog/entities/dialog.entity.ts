import { Message } from "src/message/entities/message.entity"
import { User } from "src/users/entities/user.entity"
import { Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Dialog {
    @PrimaryGeneratedColumn()
    id: number
    
    @ManyToMany(() => User)
    @JoinTable()
    users: User[]

    @OneToOne(() => Message)
    @JoinColumn()
    lastMessage: Message

    @OneToMany(() => Message, message => message.dialog)
    messages: Message[]
}
