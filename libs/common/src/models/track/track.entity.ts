import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  // ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  In,
} from 'typeorm';

import { Users } from './../users';
import { Product } from './../product';
import { Balance } from './../balance';

@Entity()
export class Track extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Users, (user) => user.track, { eager: false })
  users: Users[];

  @Column({
    nullable: true,
  })
  name: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
