import { boolean } from "joi";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('link')
export class Link {

    @PrimaryGeneratedColumn()
    id: number
    
    @Column({type: 'text', nullable: true})
    user_id: number

    @Column({type: 'text'})
    url: string
    
    @Column({type: 'text'})
    shortened_url: string

    @Column({type: 'int', default: 0})
    access_count: number

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;

    @Column({type: "boolean", default: false})
    deleted: boolean
}