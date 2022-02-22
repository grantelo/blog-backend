import {BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column({unique: true})
    email: string

    @Column({select: false})
    password: string

    @Column({select: false})
    activationLink: string

    @Column({select: false, default: false})
    isActivated: boolean

    @Column({default: ""})
    avatar: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updateAt: Date

}
