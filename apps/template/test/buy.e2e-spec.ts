import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

import {
  Users,
  Purchase,
  Product,
  ProductTypeEnum,
  Balance,
  Cart,
  NsfError,
  EmptyCartError,
  ERROR_NSF,
  ERROR_EMPTY_CART,
} from './../src/models';
import { dataSource } from './../src/config/db.config';
import { CartDto, CartItemDto } from './../src/dto/';
import { MoreThan } from 'typeorm';

describe('Lets go shopping', () => {
  let app: INestApplication;
  let allUsers: Users[];
  let poorUsers: Users[];
  let reachUsers: Users[];
  let productReal: Product;
  let productInactive: Product;
  let productAd: Product;
  let cartData: CartDto;
  let cartDataEmpty: CartDto;
  let cartModel: Cart;
  let cartModelEmpty: Cart;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    allUsers = await Users.find({ relations: ['balance'] });
    productReal = await Product.findOne({
      where: {
        type: ProductTypeEnum.REAL,
        active: true,
        price: MoreThan(0),
      },
    });
    productInactive = await Product.findOne({
      where: {
        type: ProductTypeEnum.REAL,
        active: false,
        price: MoreThan(0),
      },
    });
    productAd = await Product.findOne({ where: { type: ProductTypeEnum.AD } });

    const cartItemReal: CartItemDto = {
      id: productReal.id,
      qty: 1,
    };
    const cartItemInactive: CartItemDto = {
      id: productInactive.id,
      qty: 1,
    };
    const cartItemAd: CartItemDto = {
      id: productAd.id,
      qty: 1,
    };
    cartData = {
      content: [cartItemReal, cartItemAd, cartItemInactive],
    };
    cartDataEmpty = {
      content: [cartItemAd, cartItemInactive],
    };
    cartModel = await Cart.init(cartData);
    cartModelEmpty = await Cart.init(cartDataEmpty);

    poorUsers = [];
    reachUsers = [];
    allUsers.forEach((user) => {
      if (user.calcTotal() < cartModel.total) {
        poorUsers.push(user);
      } else {
        reachUsers.push(user);
      }
    });
  });

  afterEach(async () => {
    await Purchase.clear();
  });

  afterAll(async () => {
    await app.close();
    // await process.exit();
    // await dataSource.destroy();
  });

  describe('work with cart', () => {
    it('our cart has only one priced item', async () => {
      expect(productReal.price).toBe(cartModel.total);
    });

    it('throw error when there is nothing to buy', async () => {
      for (const index in reachUsers) {
        const user = reachUsers[index];
        await expect(async () => {
          await Balance.buy(cartDataEmpty, user.id);
        }).rejects.toBe(ERROR_EMPTY_CART);
      }
    });

    it('throw error when unsofficiant funds', async () => {
      for (const index in poorUsers) {
        const user = poorUsers[index];
        await expect(async () => {
          await Balance.buy(cartData, user.id);
        }).rejects.toBe(ERROR_NSF);
      }
    });

    it('when bought, cart price should be subdtracted from users total', async () => {
      for (const index in reachUsers) {
        const user = reachUsers[index];
        const oldTotal = user.calcTotal();

        await Balance.buy(cartData, user.id);
        await user.reload();
        const newTotal = user.calcTotal();
        expect(newTotal).toBe(oldTotal - productReal.price);
      }
    });
  });
});
