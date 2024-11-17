import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  // OneToMany,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  In,
} from 'typeorm';

import { Users } from './../users';
import { Product } from './../product';
import { Balance } from './../balance';

interface ProductPurchasesCount {
  productId: number;
  count: number;
}

@Entity()
export class Purchase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.purchases, {
    onDelete: 'CASCADE',
    eager: true,
  })
  user: Users;

  @ManyToOne(() => Product, (product) => product.purchases, {
    onDelete: 'CASCADE',
    eager: true,
  })
  product: Product;

  @ManyToOne(() => Balance, (balance) => balance.purchases, {
    onDelete: 'CASCADE',
    eager: true,
  })
  balance: Balance;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  static async countProductsPurchases(): Promise<ProductPurchasesCount[]> {
    return await Purchase.query('select "productId", count(*) from purchase group by "productId";');
  }
}
