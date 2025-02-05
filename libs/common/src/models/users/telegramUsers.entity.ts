import {
  Entity,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { Field } from '@nestjs/graphql';
import { ID } from 'type-graphql';

/**
 * Telegram users mapped to authorised webapp user
 * @see https://core.telegram.org/bots/api#user
 */
@Entity()
export class TelegramUsers extends BaseEntity {
  @Field(() => ID)
  @PrimaryColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.id, {
    onDelete: 'CASCADE',
    eager: false,
  })
  user: Users;

  @Column({
    nullable: true,
  })
  username: string;

  @Column({
    nullable: true,
  })
  firstName: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
