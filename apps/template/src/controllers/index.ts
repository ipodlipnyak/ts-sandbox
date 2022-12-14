export * from './app.controller';
export * from './auth.controller';
export * from './admin.controller';
export * from './products.controller';
export * from './purchases.controller';
export * from './track.controller';
export * from './rating.controller';
export * from './users.controller';

import { AppController } from './app.controller';
import { AdminController } from './admin.controller';
import { AuthController } from './auth.controller';
import { ProductsController } from './products.controller';
import { PurchasesController } from './purchases.controller';
import { TrackController } from './track.controller';
import { RatingController } from './rating.controller';
import { UsersController } from './users.controller';

export const controllers = [
  AppController,
  AdminController,
  AuthController,
  ProductsController,
  PurchasesController,
  TrackController,
  RatingController,
  UsersController,
];
