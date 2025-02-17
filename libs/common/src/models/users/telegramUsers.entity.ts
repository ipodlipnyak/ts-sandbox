import {
  Entity,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  Index,
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, (user) => user.id, {
    onDelete: 'CASCADE',
    eager: false,
  })
  user: Users;

  @Column({
    nullable: true,
    // length: 64
  })
  @Index({unique: true})
  tgUserId: string;

  @Column({
    nullable: true,
    // length: 64
  })
  @Index({unique: true})
  tgChatId: string;

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
