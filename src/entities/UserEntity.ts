import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class User {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column({type: 'text'})
    username: string

    @Column({type: 'text'})
    email: string

    @Column({type: 'text'})
    password: string
}