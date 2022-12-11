import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  In,
} from 'typeorm';

import { Users } from './../users';
import { Purchase } from './../purchase';
import { Product, ProductTypeEnum } from './../product';

export enum TransactionCodeEnum {
  INCOME = 100, // also corrections if income is negative
  PURCHASE = 200, // spendings on products. Should be positive
  PURCHASE_PENDING = 201, // when transaction in progress
}

import { CartDto } from './../../dto';

interface CartItem {
  product: Product;
  qty: number;
}

export class NsfError extends Error {
  name = 'NSF';
}
export const ERROR_NSF = new NsfError('Non-Sufficient Funds');

export class EmptyCartError extends Error {
  name = 'EMPTY_CART';
}
export const ERROR_EMPTY_CART = new EmptyCartError('Empty cart');

/**
 * Helper for working with cart
 */
export class Cart {
  content: CartItem[];

  constructor(content: CartItem[]) {
    this.content = content;
  }

  /**
   * Flat contant
   */
  get flat(): Product[] {
    let result = [];
    this.content.forEach((item) => {
      result = [...result, ...Array(item.qty).fill(item.product)];
    });
    return result;
  }

  /**
   * Total price of a cart
   */
  get total(): number {
    const pricesList = this.content.map((el) => el.qty * el.product.price);
    if (!pricesList?.length || pricesList.length === 0) {
      return 0;
    }
    return pricesList.reduce((p, n) => p + n);
  }

  static async init(cartDto: CartDto): Promise<Cart> {
    const { content } = cartDto;
    const idsList = content.map((el) => Number(el.id));

    const productsList = await Product.findBy({
      id: In(idsList),
      active: true,
      type: ProductTypeEnum.REAL,
    });

    const cart = productsList.map((product) => {
      const qty = Number(content.find((i) => Number(i.id) === product.id).qty);
      const cartItem: CartItem = {
        product,
        qty,
      };
      return cartItem;
    });

    return new Cart(cart);
  }
}

@Entity()
export class Balance extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.balance, {
    onDelete: 'CASCADE',
  })
  user: Users;

  @Column({
    nullable: false,
    default: 0,
  })
  value: number;

  @Column({
    type: 'enum',
    enum: TransactionCodeEnum,
    default: TransactionCodeEnum.INCOME,
  })
  code: TransactionCodeEnum;

  /**
   * aka a cart linked to this transaction
   */
  @OneToMany(() => Purchase, (purchase) => purchase.balance, { eager: false })
  purchases: Purchase[];

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  static async queryUserScore(userId: number) {
    const result = await Balance.createQueryBuilder()
      .select('SUM("Balance"."value")')
      .where({
        user: { id: userId },
        code: TransactionCodeEnum.INCOME,
      })
      .getRawOne();
    return Number(result.sum);
  }

  static async queryUserTotal(userId: number) {
    const result = await Balance.createQueryBuilder()
      .select('SUM("Balance"."value")')
      .where({
        user: { id: userId },
      })
      .getRawOne();
    return Number(result.sum);
  }

  /**
   * Create new balance entity and try to buy a cart content
   */
  static async buy(cartDto: CartDto, userId: number) {
    const user = await Users.findOne({
      where: { id: userId },
      relations: ['balance', 'purchases'],
    });
    const limit = user.calcTotal();

    // limit product purchase with one transaction
    const purchased = await user.getPurchasedProducts();
    const cartDtoFiltered: CartDto = {
      ...cartDto,
      content: cartDto.content.filter((p) => {
        const match = purchased.find((el) => el.id === p.id);
        return !match;
      }),
    };

    const cart = await Cart.init(cartDtoFiltered);

    if (cart.total > limit) {
      throw ERROR_NSF;
    }

    if (cart.content.length === 0) {
      throw ERROR_EMPTY_CART;
    }

    const transaction = new Balance();
    transaction.user = user;
    transaction.code = TransactionCodeEnum.PURCHASE_PENDING;
    transaction.value = cart.total * -1;
    await transaction.save();

    const allProducts = cart.flat.filter((p) => {
      const match = purchased.find((el) => el.id === p.id);
      return !match;
    });

    for (const index in allProducts) {
      const product = allProducts[index];
      const purchase = new Purchase();
      purchase.product = product;
      purchase.user = user;
      purchase.balance = transaction;
      await purchase.save();
    }

    transaction.code = TransactionCodeEnum.PURCHASE;
    await transaction.save();
  }
}
