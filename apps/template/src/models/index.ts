import { Friendsheep, Users, UsersResolver } from './users';
import { Balance, TransactionCodeEnum } from './balance';
import { Purchase } from './purchase';
import { Product, ProductTypeEnum } from './product';
import { Track } from './track';
import { EventResolver } from './event';
// import { Event, EventUser } from './event';

export * from './users';
export * from './balance';
export * from './product';
export * from './purchase';
export * from './track';
// export * from './event';

export const entities = {
  Users,
  Balance,
  Purchase,
  Product,
  Track,
  Friendsheep,
  // Event,
  // EventUser,
};

export const resolvers = [
  UsersResolver,
  EventResolver,
];

export const enums = {
  TransactionCodeEnum,
  ProductTypeEnum,
};
