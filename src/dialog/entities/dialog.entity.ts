import { Message } from "src/message/entities/message.entity"
import { User } from "src/users/entities/user.entity"
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Dialog {
    @PrimaryGeneratedColumn()
    id: number
    
    @ManyToMany(() => User)
    @JoinTable()
    users: User[]

    @OneToOne(() => Message, {nullable: true})
    @JoinColumn()
    lastMessage: Message

    @Column({default: 0})
    countUnread: number

    @OneToMany(() => Message, message => message.dialog)
    messages: Message[]

    @ManyToMany(() => User)
    @JoinTable()
    hidden_users: User[]
}
