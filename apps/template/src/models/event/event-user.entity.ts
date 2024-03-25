// import {
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   // OneToMany,
//   ManyToOne,
//   BaseEntity,
//   CreateDateColumn,
//   UpdateDateColumn,
//   In,
// } from 'typeorm';
// 
// import { Users } from './../users';
// import { Event } from './event.entity';
// 
// /**
//  * Join table for many to many relation between events and users
//  */
// @Entity()
// export class EventUser extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;
// 
//   @ManyToOne(() => Users, (user) => user.events, {
//     onDelete: 'CASCADE',
//     eager: true,
//   })
//   user: Users;
//   
//   @ManyToOne(() => Event, (event) => event.users, {
//     onDelete: 'CASCADE',
//     eager: true,
//   })
//   event: Event;
// 
//   @CreateDateColumn()
//   created: Date;
// 
//   @UpdateDateColumn()
//   updated: Date;
// }
// 