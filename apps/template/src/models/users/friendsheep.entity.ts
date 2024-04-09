import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './users.entity';


/**
 * Let's make some friends
 * @see https://stackoverflow.com/a/2911606 
 */
@Entity()
export class Friendsheep extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.id, {
    onDelete: 'CASCADE',
    eager: false,
  })
  user: Users;
  
  @ManyToOne(() => Users, (user) => user.id, {
    onDelete: 'CASCADE',
    eager: true,
  })
  friend: Users;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
