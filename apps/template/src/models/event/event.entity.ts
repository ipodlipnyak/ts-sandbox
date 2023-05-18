
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    // ManyToOne,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { EventUser } from './event-user.entity';


@Entity()
export class Event extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => EventUser, (user) => user.event, { eager: false })
    users: EventUser[];

    @Column({
        nullable: true,
    })
    name: string;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @Column({
        type: 'daterange',
        nullable: true,
    })
    daterange: Date;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
}
