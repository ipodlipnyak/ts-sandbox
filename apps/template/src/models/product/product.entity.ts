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

import { Purchase } from './../purchase';

export enum ProductTypeEnum {
  REAL = 'REAL', // we can sell this
  AD = 'AD', // it's just an advertising of another shop
}

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    default: true,
  })
  active: boolean;

  @Column({
    unique: true,
    nullable: false,
  })
  code: string;

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
    type: 'text',
    nullable: true,
  })
  secret: string;

  /*
  @Column({
    nullable: true,
  })
  link: string;
  */

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    nullable: false,
    default: 0,
  })
  price: number;

  @Column({
    type: 'enum',
    enum: ProductTypeEnum,
    default: ProductTypeEnum.REAL,
  })
  type: ProductTypeEnum;

  @OneToMany(() => Purchase, (purchase) => purchase.product, { eager: false })
  purchases: Purchase[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
